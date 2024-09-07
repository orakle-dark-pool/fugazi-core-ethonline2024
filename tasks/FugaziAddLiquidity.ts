import {
  FugaziOrderFacet,
  FugaziPoolActionFacet,
  FugaziViewerFacet,
} from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import chalk from "chalk";

task("task:addLiquidity")
  .addParam("name0", "Name of the token to provide liquidity", "FakeFGZ")
  .addParam("name1", "Name of the token to provide liquidity", "FakeEUR")
  .addParam("amount0", "Amount of token0 to provide", "1024")
  .addParam("amount1", "Amount of token1 to provide", "1024")
  .addParam("payprivacyfeein0", "Pay privacy fee in token0", "0")
  .addParam("noiseamplitude", "Noise amplitude", "0")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    // input arguments
    const token0Name = taskArguments.name0;
    const token1Name = taskArguments.name1;
    const token0Address = (await deployments.get(token0Name)).address;
    const token1Address = (await deployments.get(token1Name)).address;
    const amount0 = Number(taskArguments.amount0); // Amount for token0
    const amount1 = Number(taskArguments.amount1); // Amount for token1
    const payPrivacyFeeIn0 = Boolean(Number(taskArguments.payprivacyfeein0)); // Privacy fee flag
    const noiseAmplitude = Math.min(Number(taskArguments.noiseamplitude), 2047); // Noise amplitude (max 2047)

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
        `Running addLiquidity: adding ${amount0} ${token0Name} and ${amount1} ${token1Name} to pool`
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
    //                   Before addLiquidity                     //
    ///////////////////////////////////////////////////////////////

    // check balances
    console.log("Checking balances before adding liquidity...");

    // generate the permission for viewing encrypted balance in Fugazi
    let permitForFugazi = await fhenixjs.generatePermit(
      FugaziCoreDeployment.address,
      undefined, // use the internal provider
      signer
    );

    // get token balances before adding liquidity
    console.log("Getting token balances before adding liquidity... ");
    const encryptedBalance0Before = await FugaziViewerFacet.getBalance(
      token0Address,
      permitForFugazi
    );
    const decryptedBalance0Before = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalance0Before
    );
    console.log(
      `Balance of ${token0Name} before adding liquidity:`,
      decryptedBalance0Before
    );
    const encryptedBalance1Before = await FugaziViewerFacet.getBalance(
      token1Address,
      permitForFugazi
    );
    const decryptedBalance1Before = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalance1Before
    );
    console.log(
      `Balance of ${token1Name} before adding liquidity:`,
      decryptedBalance1Before
    );

    // getLPBalance before adding liquidity
    console.log("Getting LP token balance before adding liquidity... ");
    const encryptedLPBalanceBefore = await FugaziViewerFacet.getLPBalance(
      token0Address,
      token1Address,
      permitForFugazi
    );
    const decryptedLPBalanceBefore = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedLPBalanceBefore
    );
    console.log(
      `LP balance of LP token in Fugazi before adding liquidity:`,
      decryptedLPBalanceBefore
    );

    ///////////////////////////////////////////////////////////////
    //                       addLiquidity                        //
    ///////////////////////////////////////////////////////////////
    async function packAndEncryptOrder(
      amountX: number, // 15-bit number (amount for tokenX)
      amountY: number, // 15-bit number (amount for tokenY)
      noiseAmplitude: number, // 11-bit number (max 2047)
      isNoiseReferenceX: boolean, // 1-bit flag (true for tokenX noise reference)
      isSwap: boolean
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

      // Pack the values into a single BigInt
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

      // print the final packed amount in binary
      console.log("Packed amount in binary: ", packedAmount.toString(2));

      // Encrypt the packed amount using fhenixjs.encrypt_euint64()
      const encryptedPackedAmount = await fhenixjs.encrypt_uint64(packedAmount);

      return encryptedPackedAmount;
    }
    // construct input for liquidity provision
    console.log("Constructing input for liquidity provision... ");
    const poolId = await FugaziViewerFacet.getPoolId(
      token0Address,
      token1Address
    );
    const token0IsTokenX = token0Address < token1Address;
    // Variables for the packed order amounts and flags
    let amountX: number, amountY: number;
    let isNoiseReferenceX: boolean;

    // Assign amountX, amountY and isNoiseReferenceX based on token0IsTokenX
    if (token0IsTokenX) {
      amountX = amount0;
      amountY = amount1;
      isNoiseReferenceX = payPrivacyFeeIn0; // If paying privacy fee in token0, it's noise reference for tokenX
    } else {
      amountX = amount1;
      amountY = amount0;
      isNoiseReferenceX = !payPrivacyFeeIn0; // If paying privacy fee in token1, noise reference is for tokenY
    }
    // Pack the order and encrypt
    const encryptedPackedOrder = await packAndEncryptOrder(
      amountX,
      amountY,
      noiseAmplitude,
      isNoiseReferenceX,
      false
    );

    console.log(
      `Providing ${amount0} ${taskArguments.name0} and ${amount1} ${taskArguments.name1} to pool... `
    );
    try {
      const tx = await FugaziOrderFacet.submitOrder(
        poolId,
        encryptedPackedOrder
      );
      console.log(
        `Provided ${amount0} ${taskArguments.name0} and ${amount1} ${taskArguments.name1} to pool. tx hash:`,
        tx.hash
      );
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

    // claimProtocolOrder
    console.log("Claiming protocol owned account's order... ");
    try {
      const tx = await FugaziPoolActionFacet.claimProtocolOrder(
        unclaimedOrder[0],
        unclaimedOrder[1]
      );
      console.log("Claimed protocol owned account's order:", tx.hash);
    } catch (e) {
      console.log("Failed to claim protocol owned account's order", e);
    }

    // wait for 90 seconds
    console.log(
      "Waiting for 90 seconds for chain to reflect the state transition... "
    );

    ///////////////////////////////////////////////////////////////
    //                    after addLiquidity                     //
    ///////////////////////////////////////////////////////////////

    // check balances
    console.log("Checking balances after adding liquidity...");
    const encryptedBalance0After = await FugaziViewerFacet.getBalance(
      token0Address,
      permitForFugazi
    );
    const decryptedBalance0After = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalance0After
    );
    console.log(
      `Balance of ${token0Name} after adding liquidity:`,
      decryptedBalance0After
    );
    const encryptedBalance1After = await FugaziViewerFacet.getBalance(
      token1Address,
      permitForFugazi
    );
    const decryptedBalance1After = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalance1After
    );
    console.log(
      `Balance of ${token1Name} after adding liquidity:`,
      decryptedBalance1After
    );

    // check LP token balance
    console.log("Getting LP token balance after adding liquidity... ");
    const encryptedLPBalance = await FugaziViewerFacet.getLPBalance(
      token0Address,
      token1Address,
      permitForFugazi
    );
    const decryptedLPBalance = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedLPBalance
    );
    console.log(
      `LP balance of LP token in Fugazi after adding liquidity:`,
      decryptedLPBalance
    );
  });
