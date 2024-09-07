import {
  FugaziOrderFacet,
  FugaziPoolActionFacet,
  FugaziViewerFacet,
} from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import chalk from "chalk";

task("task:swap")
  .addParam("namein", "Name of the token to sell", "FakeEUR")
  .addParam("amountin", "Amount of token to sell", "512")
  .addParam("nameout", "Name of the token to buy", "FakeFGZ")
  .addParam("noiseamplitude", "Noise amplitude", "0")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    // input arguments
    const amountin = Number(taskArguments.amountin);
    const inputTokenAddress = (await deployments.get(taskArguments.namein))
      .address;
    const outputTokenAddress = (await deployments.get(taskArguments.nameout))
      .address;
    const noiseAmplitude = Math.min(
      Number(taskArguments.noiseamplitude),
      Number(2047)
    );

    // deployments
    const FugaziCoreDeployment = await deployments.get("FugaziCore");
    const FugaziOrderFacetDeployment = await deployments.get(
      "FugaziOrderFacet"
    );
    const FugaziPoolActionFacetDeployment = await deployments.get(
      "FugaziPoolActionFacet"
    );
    const FugaziViewerFacetDeployment = await deployments.get(
      "FugaziViewerFacet"
    );

    // load contracts with each abi
    const FugaziOrderFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziOrderFacetDeployment.abi,
      signer
    ) as unknown as FugaziOrderFacet;
    const FugaziPoolActionFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziPoolActionFacetDeployment.abi,
      signer
    ) as unknown as FugaziPoolActionFacet;
    const FugaziViewerFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziViewerFacetDeployment.abi,
      signer
    ) as unknown as FugaziViewerFacet;

    // console.log
    console.log("*".repeat(50));
    console.log(
      chalk.yellow(
        `Running swap: swapping ${amountin} ${taskArguments.namein} for ${taskArguments.nameout}.`
      )
    );
    console.log(chalk.yellow(`Noise Level: ${(noiseAmplitude * 100) / 1024}%`));

    // enable noise
    try {
      console.log("Enabling noise... ");
      const tx = await FugaziPoolActionFacet.toggleNoiseOrder(true);
      console.log("Enabled noise:", tx.hash);
    } catch (e) {
      console.log("Failed to enable noise", e);
    }

    ///////////////////////////////////////////////////////////////
    //                       Before swap                         //
    ///////////////////////////////////////////////////////////////

    // check balances
    console.log("Checking balances before swap...");

    // generate the permit for viewing encrypted balance in Fugazi
    let permitForFugazi = await fhenixjs.generatePermit(
      FugaziCoreDeployment.address,
      undefined, // use the internal provider
      signer
    );

    // get token balances before swapping
    console.log("Getting token balances before swapping... ");
    const encryptedBalanceInBefore = await FugaziViewerFacet.getBalance(
      inputTokenAddress,
      permitForFugazi
    );
    const decryptedBalanceInBefore = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalanceInBefore
    );
    console.log(
      `Balance of ${taskArguments.namein} before swap: ${decryptedBalanceInBefore}`
    );
    const encryptedBalanceOutBefore = await FugaziViewerFacet.getBalance(
      outputTokenAddress,
      permitForFugazi
    );
    const decryptedBalanceOutBefore = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalanceOutBefore
    );
    console.log(
      `Balance of ${taskArguments.nameout} before swap: ${decryptedBalanceOutBefore}`
    );

    // get LP token balance before swapping
    console.log("Getting LP token balance before swapping... ");
    const encryptedLPBalanceBefore = await FugaziViewerFacet.getLPBalance(
      inputTokenAddress,
      outputTokenAddress,
      permitForFugazi
    );
    const decryptedLPBalanceBefore = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedLPBalanceBefore
    );
    console.log(`LP Balance before swap: ${decryptedLPBalanceBefore}`);

    ///////////////////////////////////////////////////////////////
    //                           swap                            //
    ///////////////////////////////////////////////////////////////

    // Function to pack the input and encrypt it (reused from the previous script)
    async function packAndEncryptOrder(
      amountX: number, // 15-bit number (amount for tokenX)
      amountY: number, // 15-bit number (amount for tokenY)
      noiseAmplitude: number, // 11-bit number (max 2047)
      isNoiseReferenceX: boolean, // 1-bit flag (true for tokenX noise reference)
      isSwap: boolean // 1-bit flag (true for swap, false for adding liquidity)
    ) {
      // Validate the input values to ensure they fit in their respective bit sizes
      if (amountX < 0 || amountX > 32767) {
        throw new Error("amountX must be between 0 and 32767 (15 bits)");
      }
      if (amountY < 0 || amountY > 32767) {
        throw new Error("amountY must be between 0 and 32767 (15 bits)");
      }
      if (noiseAmplitude < 0 || noiseAmplitude > 2047) {
        throw new Error("noiseAmplitude must be between 0 and 2047 (11 bits)");
      }

      // Pack the values into a single bigint
      let packedAmount: bigint = BigInt(0);

      // Pack amountY (15 bits)
      packedAmount |= BigInt(amountY);

      // Pack amountX (15 bits), shift it by 15
      packedAmount |= BigInt(amountX) << BigInt(15);

      // Pack isSwap (1 bit), shift by 30 (isSwap = true means 0 for swap, 1 for addLiquidity)
      packedAmount |= BigInt(isSwap ? 0 : 1) << BigInt(30);

      // Pack isNoiseReferenceX (1 bit), shift by 31
      packedAmount |= BigInt(isNoiseReferenceX ? 1 : 0) << BigInt(31);

      // Pack noiseAmplitude (11 bits), shift by 32
      packedAmount |= BigInt(noiseAmplitude) << BigInt(32);

      // Log the packed amount in binary
      console.log("Packed amount in binary: ", packedAmount.toString(2));

      // Encrypt the packed amount using fhenixjs.encrypt_euint64()
      const encryptedPackedAmount = await fhenixjs.encrypt_uint64(packedAmount);

      return encryptedPackedAmount;
    }

    // construct input for swap
    console.log("Constructing input for swap... ");
    const poolId = await FugaziViewerFacet.getPoolId(
      inputTokenAddress,
      outputTokenAddress
    );
    const payPrivacyFeeInInputToken = true; // The privacy fee is always paid in the input token (i.e., isNoiseReferenceX will always be true for input token)
    const inputTokenIsTokenX = inputTokenAddress < outputTokenAddress; // Determine if input token is tokenX or tokenY based on address comparison
    // Variables for the packed order amounts and flags
    let amountX: number, amountY: number;
    let isNoiseReferenceX: boolean;

    // Assign amountX, amountY and isNoiseReferenceX based on inputTokenIsTokenX
    if (inputTokenIsTokenX) {
      amountX = amountin; // Input token is tokenX
      amountY = 0; // Since it's a swap, we don't provide tokenY directly
      isNoiseReferenceX = payPrivacyFeeInInputToken; // Noise reference is true for the input token
    } else {
      amountX = 0; // Since it's a swap, we don't provide tokenX directly
      amountY = amountin; // Input token is tokenY
      isNoiseReferenceX = !payPrivacyFeeInInputToken; // Noise reference is false for the output token
    }

    // Set isSwap to true since it's a swap operation
    const isSwap = true;

    // Pack the order and encrypt
    const encryptedPackedOrder = await packAndEncryptOrder(
      amountX,
      amountY,
      noiseAmplitude,
      isNoiseReferenceX,
      isSwap
    );

    console.log(
      `Swapping ${amountin} ${taskArguments.namein} for ${taskArguments.nameout}... `
    );
    try {
      const tx = await FugaziOrderFacet.submitOrder(
        poolId,
        encryptedPackedOrder
      );
      console.log("Swapped:", tx.hash);
    } catch (error) {
      console.error(error);
    }

    // wait for 90 seconds
    console.log(
      "Waiting for 90 seconds for chain to reflect the state transition... "
    );
    await new Promise((resolve) => setTimeout(resolve, 90000));

    // check the last unclaimedOrder
    console.log("Checking unclaimed order... ");
    const unlaimedOrdersLength = Number(
      await FugaziViewerFacet.getUnclaimedOrdersLength()
    );
    const unclaimedOrder = await FugaziViewerFacet.getUnclaimedOrder(
      unlaimedOrdersLength - 1
    );
    console.log("Unclaimed order:", unclaimedOrder);

    ///////////////////////////////////////////////////////////////
    //                       settleBatch                         //
    ///////////////////////////////////////////////////////////////

    console.log("Settling batch... "); // settle batch
    try {
      const tx = await FugaziPoolActionFacet.settleBatch(poolId);
      console.log("Settled batch:", tx.hash);
    } catch (e) {
      console.log("Failed to settle batch", e);
    }

    // wait for 90 seconds
    console.log(
      "Waiting for 90 seconds for chain to reflect the state transition... "
    );
    await new Promise((resolve) => setTimeout(resolve, 90000));

    ///////////////////////////////////////////////////////////////
    //                          claim                            //
    ///////////////////////////////////////////////////////////////

    console.log("Claiming... ");
    try {
      const tx = await FugaziPoolActionFacet.claim(
        unclaimedOrder[0],
        unclaimedOrder[1]
      );
      console.log("Claimed:", tx.hash);
    } catch (e) {
      console.log("Failed to claim", e);
    }

    // wait for 90 seconds
    console.log(
      "Waiting for 90 seconds for chain to reflect the state transition... "
    );
    await new Promise((resolve) => setTimeout(resolve, 90000));

    // claim protocol order
    console.log("Claiming protocol order... ");
    try {
      const tx = await FugaziPoolActionFacet.claimProtocolOrder(
        unclaimedOrder[0],
        unclaimedOrder[1]
      );
      console.log("Claimed protocol order:", tx.hash);
    } catch (e) {
      console.log("Failed to claim protocol order", e);
    }

    // wait for 90 seconds
    console.log(
      "Waiting for 90 seconds for chain to reflect the state transition... "
    );

    ///////////////////////////////////////////////////////////////
    //                       After swap                          //
    ///////////////////////////////////////////////////////////////

    // check balances after swapping
    console.log("Checking balances after swapping...");

    // get token balances after swapping
    console.log("Getting token balances after swapping... ");
    const encryptedBalanceInAfter = await FugaziViewerFacet.getBalance(
      inputTokenAddress,
      permitForFugazi
    );
    const decryptedBalanceInAfter = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalanceInAfter
    );
    console.log(
      `Balance of ${taskArguments.namein} after swap: ${decryptedBalanceInAfter}`
    );
    const encryptedBalanceOutAfter = await FugaziViewerFacet.getBalance(
      outputTokenAddress,
      permitForFugazi
    );
    const decryptedBalanceOutAfter = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalanceOutAfter
    );
    console.log(
      `Balance of ${taskArguments.nameout} after swap: ${decryptedBalanceOutAfter}`
    );

    // get LP token balance after swapping
    console.log("Getting LP token balance after swapping... ");
    const encryptedLPBalanceAfter = await FugaziViewerFacet.getLPBalance(
      inputTokenAddress,
      outputTokenAddress,
      permitForFugazi
    );
    const decryptedLPBalanceAfter = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedLPBalanceAfter
    );
    console.log(`LP Balance after swap: ${decryptedLPBalanceAfter}`);
  });
