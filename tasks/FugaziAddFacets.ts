import { FugaziCore } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import chalk from "chalk";

task("task:addFacets").setAction(async function (
  taskArguments: TaskArguments,
  hre
) {
  const { fhenixjs, ethers, deployments } = hre;
  const [signer] = await ethers.getSigners();

  console.log("*".repeat(50));
  console.log(chalk.yellow("Running addFacets"));

  // load the FugaziCore contract
  console.log("Loading FugaziCore contract... ");
  const fugaziDeployment = await deployments.get("FugaziCore");
  const FugaziCore = new ethers.Contract(
    fugaziDeployment.address,
    fugaziDeployment.abi,
    signer
  ) as unknown as FugaziCore;

  // load the addresses of the facets
  console.log("Loading facet addresses... ");
  const FugaziBalanceFacet = await deployments.get("FugaziBalanceFacet");
  const FugaziViewerFacet = await deployments.get("FugaziViewerFacet");
  const FugaziPoolRegistryFacet = await deployments.get(
    "FugaziPoolRegistryFacet"
  );
  const FugaziOrderFacet = await deployments.get("FugaziOrderFacet");
  const FugaziPoolActionFacet = await deployments.get("FugaziPoolActionFacet");

  // construct the input array
  console.log("Constructing input array... ");
  const facetsAndSelectors = [
    {
      facet: FugaziBalanceFacet.address,
      selectors: [
        "a6462d0a", // deposit
        "e94af36e", // withdraw
        "441cc944", // donateToProtocol
        "4960b29d", // harvest
      ],
    },
    {
      facet: FugaziViewerFacet.address,
      selectors: [
        "08b3f650", // getBalance
        "a0ebf057", // getLPBalance
        "2ef61c21", // getPoolId
        "09f2c019", // getPoolInfo
        "c7c13129", // getUnclaimedOrdersLength
        "6697d691", // getUnclaimedOrder
        "c0df2df2", // getUnclaimedOrders
        "7e1d91d4", // getUnclaimedProtocolOrdersLength
        "305d8812", // getUnclaimedProtocolOrder
      ],
    },
    {
      facet: FugaziPoolRegistryFacet.address,
      selectors: [
        "46727639", // createPool
      ],
    },
    {
      facet: FugaziOrderFacet.address,
      selectors: [
        "ba198d5f", // submitOrder
        "f5398acd", // removeLiquidity
      ],
    },
    {
      facet: FugaziPoolActionFacet.address,
      selectors: [
        "eeb8f2b5", // settleBatch
        "1bcc8d25", // claim
        "b258399d", // claimProtocolOrder
      ],
    },
  ];
  const facetAndSelectorsArray = facetsAndSelectors.flatMap(
    ({ facet, selectors }) =>
      selectors.map((selector) => ({
        facet,
        selector: `0x${selector}`,
      }))
  );

  // call the addFacet function
  console.log("Adding facets and selectors... ");
  const tx = await FugaziCore.addFacet(facetAndSelectorsArray);
  await tx.wait();
  console.log("Facets and selectors added successfully! tx hash:", tx.hash);
});
