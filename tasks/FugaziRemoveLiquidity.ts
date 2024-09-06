import { FugaziOrderFacet, FugaziViewerFacet } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import chalk from "chalk";

task("task:removeLiquidity")
  .addParam("name0", "Name of the token to remove liquidity from", "FakeFGZ")
  .addParam("name1", "Name of the token to remove liquidity from", "FakeUSD")
  .addParam("amount", "Amount of liquidity to remove", "100")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    // input arguments
    const token0Name = taskArguments.name0;
    const token1Name = taskArguments.name1;
    const token0Address = (await deployments.get(token0Name)).address;
    const token1Address = (await deployments.get(token1Name)).address;
    const amount = Number(taskArguments.amount);

    // deployments
    const FugaziCoreDeployment = await deployments.get("FugaziCore");
    const FugaziOrderFacetDeployment = await deployments.get(
      "FugaziOrderFacet"
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
    const FugaziViewerFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziViewerFacetDeployment.abi,
      signer
    ) as unknown as FugaziViewerFacet;

    // console.log
    console.log("*".repeat(50));
    console.log(
      chalk.yellow(
        `Running removeLiquidity: removing ${amount} liquidity from pool of ${token0Name} and ${token1Name}`
      )
    );

    ///////////////////////////////////////////////////////////////
    //                  Before removeLiquidity                   //
    ///////////////////////////////////////////////////////////////

    // check balances before removing liquidity
    console.log("Checking balances before removing liquidity...");

    // generate the permit for viewing encrypted balance in Fugazi
    let permitForFugazi = await fhenixjs.generatePermit(
      FugaziCoreDeployment.address,
      undefined, // use the internal provider
      signer
    );

    // get token balances before removing liquidity
    console.log("Getting token balances before removing liquidity... ");
    const encryptedBalance0Before = await FugaziViewerFacet.getBalance(
      token0Address,
      permitForFugazi
    );
    const decryptedBalance0Before = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalance0Before
    );
    console.log(
      `Got decrypted balance of ${token0Name} in Fugazi before removing liquidity:`,
      decryptedBalance0Before.toString()
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
      `Got decrypted balance of ${token1Name} in Fugazi before removing liquidity:`,
      decryptedBalance1Before.toString()
    );

    // get LP token balance before removing liquidity
    console.log("Getting LP token balance before removing liquidity... ");
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
      `Got decrypted LP balance in Fugazi before removing liquidity:`,
      decryptedLPBalanceBefore.toString()
    );

    ///////////////////////////////////////////////////////////////
    //                      removeLiquidity                      //
    ///////////////////////////////////////////////////////////////

    console.log("Removing liquidity... ");
    try {
      // construct input
      const poolId = await FugaziViewerFacet.getPoolId(
        token0Address,
        token1Address
      );
      const encryptedAmount = await fhenixjs.encrypt_uint32(amount);

      // send tx
      const tx = await FugaziOrderFacet.removeLiquidity(
        poolId,
        encryptedAmount
      );
      console.log(`Removed ${amount} liquidity from pool. tx hash:`, tx.hash);
    } catch (e) {
      console.log("Failed to remove liquidity", e);
    }

    ///////////////////////////////////////////////////////////////
    //                   After removeLiquidity                   //
    ///////////////////////////////////////////////////////////////

    // check balances after removing liquidity
    console.log("Checking balances after removing liquidity...");

    // get token balances after removing liquidity
    console.log("Getting token balances after removing liquidity... ");
    const encryptedBalance0After = await FugaziViewerFacet.getBalance(
      token0Address,
      permitForFugazi
    );
    const decryptedBalance0After = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalance0After
    );
    console.log(
      `Got decrypted balance of ${token0Name} in Fugazi after removing liquidity:`,
      decryptedBalance0After.toString()
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
      `Got decrypted balance of ${token1Name} in Fugazi after removing liquidity:`,
      decryptedBalance1After.toString()
    );

    // get LP token balance after removing liquidity
    console.log("Getting LP token balance after removing liquidity... ");
    const encryptedLPBalanceAfter = await FugaziViewerFacet.getLPBalance(
      token0Address,
      token1Address,
      permitForFugazi
    );
    const decryptedLPBalanceAfter = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedLPBalanceAfter
    );
    console.log(
      `Got decrypted LP balance in Fugazi after removing liquidity:`,
      decryptedLPBalanceAfter.toString()
    );
  });
