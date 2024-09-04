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
  .addParam("name1", "Name of the token to provide liquidity", "FakeUSD")
  .addParam("amount0", "Amount of token0 to provide", "100")
  .addParam("amount1", "Amount of token1 to provide", "100")
  .addParam("payprivacyfeein0", "Pay privacy fee in token0", "true")
  .addParam("noiseamplitude", "Noise amplitude", "1024")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    // input arguments
    const token0Name = taskArguments.name0;
    const token1Name = taskArguments.name1;
    const token0Address = (await deployments.get(token0Name)).address;
    const token1Address = (await deployments.get(token1Name)).address;
    const amount0 = Number(taskArguments.amount0);
    const amount1 = Number(taskArguments.amount1);
    const payPrivacyFeeIn0 = taskArguments.payPrivacyFeeIn0 === "true";
    const noiseAmplitude = Math.min(
      Number(taskArguments.noiseAmplitude),
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
        `Running addLiquidity: adding ${amount0} ${token0Name} and ${amount1} ${token1Name} to pool`
      )
    );

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

    // construct input for liquidity provision
    console.log("Constructing input for liquidity provision... ");
    const inputAmount =
      token0Address < token1Address
        ? (amount0 << 15) + amount1 + 1073741824
        : (amount1 << 15) + amount0 + 1073741824;
    const payPrivacyFeeInX =
      token0Address < token1Address ? payPrivacyFeeIn0 : ~payPrivacyFeeIn0;
    const newInputAmount = payPrivacyFeeInX
      ? inputAmount + (noiseAmplitude << 32)
      : inputAmount + 2147483648 + (noiseAmplitude << 32);
    const encryptedInput = await fhenixjs.encrypt_uint64(
      BigInt(newInputAmount)
    );
    const poolId = await FugaziViewerFacet.getPoolId(
      token0Address,
      token1Address
    );

    console.log(
      `Providing ${amount0} ${taskArguments.name0} and ${amount1} ${taskArguments.name1} to pool... `
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
