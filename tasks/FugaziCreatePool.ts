import {
  FugaziBalanceFacet,
  FugaziPoolRegistryFacet,
  FugaziViewerFacet,
} from "../types";
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
    const amount0 = Math.floor((taskArguments.amount0 * 9) / 10);
    const donateAmount0 = Number(taskArguments.amount0) - amount0;
    const token0Name = taskArguments.name0;
    const amount1 = Math.floor((taskArguments.amount1 * 9) / 10);
    const donateAmount1 = Number(taskArguments.amount1) - amount1;
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
    const FugaziBalanceFacetDeployment = await deployments.get(
      "FugaziBalanceFacet"
    );

    // load FugaziCore contracts with abis of the facets
    const FugaziPoolRegistryFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziPoolRegistryFacetDeployment.abi,
      signer
    ) as unknown as FugaziPoolRegistryFacet;
    const FugaziViewerFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziViewerFacetDeployment.abi,
      signer
    ) as unknown as FugaziViewerFacet;
    const FugaziBalanceFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziBalanceFacetDeployment.abi,
      signer
    ) as unknown as FugaziBalanceFacet;

    // console.log
    console.log("*".repeat(50));
    console.log(
      chalk.yellow(
        `Running createPool: creating pool for ${token0Name} and ${token1Name}`
      )
    );

    ///////////////////////////////////////////////////////////////
    //                   Before Pool Creation                    //
    ///////////////////////////////////////////////////////////////

    // try getPoolId before creation
    console.log("Getting pool id before creation... ");
    try {
      const poolId = await FugaziViewerFacet.getPoolId(
        token0Address,
        token1Address
      );
      console.log(`Pool Id for ${token0Name} and ${token1Name}:`, poolId);
    } catch (e) {
      console.log("Failed to load poolId", e);
    }

    // generate the permit for viewing encrypted balance in Fugazi
    let permitForFugazi = await fhenixjs.generatePermit(
      FugaziCoreDeployment.address,
      undefined, // use the internal provider
      signer
    );

    // get token balances before creation
    console.log("Getting token balances before creation... ");
    const encryptedBalance0Before = await FugaziViewerFacet.getBalance(
      token0Address,
      permitForFugazi
    );
    const decryptedBalance0Before = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalance0Before
    );
    console.log(
      `Got decrypted balance of ${token0Name} in Fugazi before creation:`,
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
      `Got decrypted balance of ${token1Name} in Fugazi before creation:`,
      decryptedBalance1Before.toString()
    );

    ///////////////////////////////////////////////////////////////
    //                      Create new Pool                      //
    ///////////////////////////////////////////////////////////////

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

    ///////////////////////////////////////////////////////////////
    //                    After Pool Creation                    //
    ///////////////////////////////////////////////////////////////

    // get pool id after creation & donate to the pool to bootstrap the protocol owned account
    console.log("Getting pool id after creation... ");
    try {
      // get pool id
      const poolId = await FugaziViewerFacet.getPoolId(
        token0Address,
        token1Address
      );

      // construct donate input
      let donateAmountX, donateAmountY;
      if (token0Address < token1Address) {
        donateAmountX = donateAmount0;
        donateAmountY = donateAmount1;
      } else {
        donateAmountX = donateAmount1;
        donateAmountY = donateAmount0;
      }
      const donateInputNumber = (donateAmountX << 15) + donateAmountY;
      const encryptedDonateInputNumber = await fhenixjs.encrypt_uint32(
        donateInputNumber
      );

      // donate to the pool
      console.log("Donating to the pool... ");
      const tx = await FugaziBalanceFacet.donateToProtocol(
        poolId,
        encryptedDonateInputNumber
      );
      console.log(
        `Donated to the pool for ${token0Name} and ${token1Name}. tx hash:`,
        tx.hash
      );
    } catch (e) {
      console.log("Failed to donate to the pool", e);
    }

    // get token balances after creation
    console.log("Getting token balances after creation... ");
    const encryptedBalance0After = await FugaziViewerFacet.getBalance(
      token0Address,
      permitForFugazi
    );
    const decryptedBalance0After = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalance0After
    );
    console.log(
      `Got decrypted balance of ${token0Name} in Fugazi after creation:`,
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
      `Got decrypted balance of ${token1Name} in Fugazi after creation:`,
      decryptedBalance1After.toString()
    );

    // get LP token balance after creation
    console.log("Getting LP token balance after creation... ");
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
      `Got decrypted LP balance of LP token in Fugazi after creation:`,
      decryptedLPBalance.toString()
    );
  });
