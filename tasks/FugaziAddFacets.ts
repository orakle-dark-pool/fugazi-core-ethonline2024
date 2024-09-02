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
  const FugaziDiamond = new ethers.Contract(
    fugaziDeployment.address,
    fugaziDeployment.abi,
    signer
  ) as unknown as FugaziCore;

  // load the addresses of the facets
  console.log("Loading facet addresses... ");
  const FugaziBalanceFacet = await deployments.get("FugaziBalanceFacet");

  // construct the input array
  console.log("Constructing input array... ");
  const facetsAndSelectors = [
    {
      facet: FugaziBalanceFacet.address,
      selectors: [
        "a6462d0a", // deposit
        "e94af36e", // withdraw
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
  const tx = await FugaziDiamond.addFacet(facetAndSelectorsArray);
  await tx.wait();
  console.log("Facets and selectors added successfully! tx hash:", tx.hash);
});
