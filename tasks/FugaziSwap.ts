import {
  FugaziOrderFacet,
  FugaziPoolActionFacet,
  FugaziViewerFacet,
} from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import chalk from "chalk";

task("task:swap")
  .addParam("namein", "Name of the token to sell", "FakeUSD")
  .addParam("amountin", "Amount of token to sell (plaintext number)", "256")
  .addParam("nameout", "Name of the token to buy", "FakeFGZ")
  .addParam("noiseamplitude", "Noise amplitude", "1024")
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
    console.log(chalk.yellow(`Noise Level: ${(noiseAmplitude * 100) / 2048}%`));

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

    ///////////////////////////////////////////////////////////////
    //                           swap                            //
    ///////////////////////////////////////////////////////////////

    // construct input for swap
    console.log("Constructing input for swap... ");
    const poolId = await FugaziViewerFacet.getPoolId(
      inputTokenAddress,
      outputTokenAddress
    );
    let inputAmount =
      inputTokenAddress < outputTokenAddress // is inputToken == tokenX?
        ? (2 << 30) * 0 + (amountin << 15)
        : (2 << 30) * 0 + amountin;
    const payPrivacyFeeInX =
      inputTokenAddress < outputTokenAddress ? true : false;
    inputAmount = payPrivacyFeeInX
      ? inputAmount + (noiseAmplitude << 32)
      : inputAmount + 2147483648 + (noiseAmplitude << 32);
    const encryptedInput = await fhenixjs.encrypt_uint64(BigInt(inputAmount));

    console.log(
      `Swapping ${amountin} ${taskArguments.namein} for ${taskArguments.nameout}... `
    );
    try {
      const tx = await FugaziOrderFacet.submitOrder(poolId, encryptedInput);
      await tx.wait();
    } catch (error) {
      console.error(error);
    }

    // wait for 1 minute
    console.log("Waiting for 1 minute... ");
    await new Promise((r) => setTimeout(r, 60000));

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
    await new Promise((resolve) => setTimeout(resolve, 60 * 1000));

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
    await new Promise((resolve) => setTimeout(resolve, 60 * 1000));

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
  });
