// This should be updated whenever new facet is added
import { DeployFunction } from "hardhat-deploy/types";
import chalk from "chalk";

const hre = require("hardhat");

const func: DeployFunction = async function () {
  const { fhenixjs, ethers } = hre;
  const { deploy } = hre.deployments;
  const [signer] = await ethers.getSigners();

  // Check if account is funded and fund if not
  if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
    if (hre.network.name === "localfhenix") {
      await fhenixjs.getFunds(signer.address);
    } else {
      console.log(
        chalk.red(
          "Please fund your account with testnet FHE from https://faucet.fhenix.zone"
        )
      );
      return;
    }
  }

  // Deploy contracts without constructor arguments
  const deployNoArgContract = async (contractName: string) => {
    const contract = await deploy(contractName, {
      from: signer.address,
      log: true,
      skipIfAlreadyDeployed: false,
    });

    console.log(`${contractName} contract deployed at: `, contract.address);
  };

  // Main deployment function
  async function main() {
    console.log("*".repeat(50));
    console.log(chalk.yellow("Deploying Fugazi contracts..."));
    await deployNoArgContract("FugaziCore");
    await deployNoArgContract("FugaziBalanceFacet");
    await deployNoArgContract("FugaziViewerFacet");
    await deployNoArgContract("FugaziPoolRegistryFacet");
    await deployNoArgContract("FugaziOrderFacet");
  }

  await main();
};

export default func;
func.id = "deploy_Fugazi";
func.tags = ["Fugazi"];
