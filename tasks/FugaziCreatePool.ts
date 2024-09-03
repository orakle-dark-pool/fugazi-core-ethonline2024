import { FugaziPoolRegistryFacet, FugaziViewerFacet } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import chalk from "chalk";

task("task:createPool")
  .addParam("name0", "Name of the token to create pool for", "FakeFGZ")
  .addParam("amount0", "Amount of token0 to deposit", "16384")
  .addParam("name1", "Name of the token to create pool for", "FakeUSD")
  .addParam("amount1", "Amount of token1 to deposit ", "16384")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    // input arguments
    const amount0 = Number(taskArguments.amount0);
    const token0Name = taskArguments.name0;
    const amount1 = Number(taskArguments.amount1);
    const token1Name = taskArguments.name1;

    // deployments
    const token0Address = (await deployments.get(token0Name)).address;
    const token1Address = (await deployments.get(token1Name)).address;
    const FugaziCoreDeployment = await deployments.get("FugaziCore");
    const FugaziPoolRegistryFacetDeployment = await deployments.get(
      "FugaziPoolRegistryFacet"
    );
    const FugaziViewerFacetDeployment = await deployments.get(
      "FugaziViewerFacet"
    );

    // load FugaziCore contracts with abis of the facets
    const FugaziPoolRegistryFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziPoolRegistryFacetDeployment.abi,
      signer
    ) as unknown as FugaziPoolRegistryFacet;
    const FugaziViwerFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziViewerFacetDeployment.abi,
      signer
    ) as unknown as FugaziViewerFacet;

    // console.log
    console.log("*".repeat(50));
    console.log(
      chalk.yellow(
        `Running createPool: creating pool for ${token0Name} and ${token1Name}`
      )
    );

    // try getPoolId before creation
    console.log("Getting pool id before creation... ");
    try {
      const poolId = await FugaziViwerFacet.getPoolId(
        token0Address,
        token1Address
      );
      console.log(`Pool Id for ${token0Name} and ${token1Name}:`, poolId);
    } catch (e) {
      console.log("Failed to load poolId", e);
    }

    //construct input
    console.log("Constructing input... ");
    let amountX, amountY;
    if (token0Address < token1Address) {
      amountX = amount0;
      amountY = amount1;
    } else {
      amountX = amount1;
      amountY = amount0;
    }
    console.log("AmountX in binary: ", amountX.toString(2));
    console.log("AmountY in binary: ", amountY.toString(2));
    const inputNumber = (amountX << 15) + amountY;
    console.log("Input number in binary: ", inputNumber.toString(2));
    const encryptedInputNumber = await fhenixjs.encrypt_uint32(inputNumber);

    // create pool
    console.log("Creating pool... ");
    try {
      const tx =
        token0Address < token1Address
          ? await FugaziPoolRegistryFacet.createPool(
              token0Address,
              token1Address,
              encryptedInputNumber
            )
          : await FugaziPoolRegistryFacet.createPool(
              token1Address,
              token0Address,
              encryptedInputNumber
            );
      console.log(
        `Created pool for ${token0Name} and ${token1Name}. tx hash:`,
        tx.hash
      );
    } catch (e) {
      console.log("Error creating pool: ", e);
    }

    // get pool id after creation
    console.log("Getting pool id after creation... ");
    try {
      const poolId = await FugaziViwerFacet.getPoolId(
        token0Address,
        token1Address
      );
      console.log(`Pool Id for ${token0Name} and ${token1Name}:`, poolId);
    } catch (e) {
      console.log("Failed to load poolId", e);
    }
  });
