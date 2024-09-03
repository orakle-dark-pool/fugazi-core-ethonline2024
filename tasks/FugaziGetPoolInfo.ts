import { FugaziViewerFacet } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import chalk from "chalk";

task("task:getPoolInfo")
  .addParam("name0", "Name of the token0 of pool", "FakeFGZ")
  .addParam("name1", "Name of the token1 of pool", "FakeUSD")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    // input arguments
    const token0Name = taskArguments.name0;
    const token1Name = taskArguments.name1;
    const token0Address = (await deployments.get(token0Name)).address;
    const token1Address = (await deployments.get(token1Name)).address;

    // load contracts
    const FugaziCoreDeployment = await deployments.get("FugaziCore");
    const FugaziViewerFacetDeployment = await deployments.get(
      "FugaziViewerFacet"
    );
    const FugaziViewer = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziViewerFacetDeployment.abi,
      signer
    ) as unknown as FugaziViewerFacet;

    // console.log
    console.log("*".repeat(50));
    console.log(
      chalk.yellow(
        `Running getPoolInfo: getting pool info for ${token0Name} and ${token1Name}`
      )
    );

    // getPoolId
    console.log("Getting pool id... ");
    const poolId = await FugaziViewer.getPoolId(token0Address, token1Address);
    console.log(`Pool Id for ${token0Name} and ${token1Name}:`, poolId);

    // getPoolInfo
    console.log("Getting pool info... ");
    const poolInfo = await FugaziViewer.getPoolInfo(poolId);
    console.log(`Pool Info for ${token0Name} and ${token1Name}:`);
    console.log("Current Epoch:", poolInfo[0].toString());
    console.log("Last Settlement:", new Date(Number(poolInfo[1]) * 1000));
  });
