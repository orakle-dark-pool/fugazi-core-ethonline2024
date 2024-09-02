import {
  FugaziBalanceFacet,
  FugaziViewerFacet,
  FHERC20Mintable,
} from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import chalk from "chalk";

task("task:withdraw")
  .addParam("name", "Name of the token to withdraw", "FakeFGZ")
  .addParam("amount", "Amount to withdraw", "1")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();
    const amountToWithdraw = Number(taskArguments.amount);
    const tokenName = taskArguments.name;

    // deployments
    const tokenDeployment = await deployments.get(tokenName);
    const FugaziCoreDeployment = await deployments.get("FugaziCore");
    const FugaziBalanceFacetDeployment = await deployments.get(
      "FugaziBalanceFacet"
    );
    const FugaziViewerFacetDeployment = await deployments.get(
      "FugaziViewerFacet"
    );

    // console.log
    console.log("*".repeat(50));
    console.log(
      chalk.yellow(
        `Running withdraw: withdrawing ${amountToWithdraw} ${tokenName} from Fugazi`
      )
    );

    ///////////////////////////////////////////////////////////////
    //                  Balances before withdraw                 //
    ///////////////////////////////////////////////////////////////

    // load the token contract
    const token = (await ethers.getContractAt(
      "FHERC20Mintable",
      tokenDeployment.address,
      signer
    )) as unknown as FHERC20Mintable;

    // generate the permit for viewing encrypted balance in wallet
    let permitForToken = await fhenixjs.generatePermit(
      tokenDeployment.address,
      undefined, // use the internal provider
      signer
    );

    // load the FugaziCore contract with FugaziViewerFacet abi
    const FugaziViewerFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziViewerFacetDeployment.abi,
      signer
    ) as unknown as FugaziViewerFacet;

    // generate the permit for viewing encrypted balance in Fugazi
    let permitForFugazi = await fhenixjs.generatePermit(
      FugaziCoreDeployment.address,
      undefined, // use the internal provider
      signer
    );

    // check the encrypted balances in wallet before withdraw
    const encryptedBalanceBefore = await token.balanceOfEncrypted(
      signer.address,
      permitForToken
    );
    const decryptedBalanceBefore = fhenixjs.unseal(
      tokenDeployment.address,
      encryptedBalanceBefore
    );
    console.log(
      `Got decrypted balance in wallet before withdraw:`,
      decryptedBalanceBefore.toString()
    );

    // check the encrypted balance in Fugazi before withdraw
    const encryptedBalanceFugaziBefore = await FugaziViewerFacet.getBalance(
      tokenDeployment.address,
      permitForFugazi
    );
    const decryptedBalanceFugaziBefore = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalanceFugaziBefore
    );
    console.log(
      `Got decrypted balance in Fugazi before withdraw:`,
      decryptedBalanceFugaziBefore.toString()
    );

    ///////////////////////////////////////////////////////////////
    //                   Withdraw from Fugazi                    //
    ///////////////////////////////////////////////////////////////

    // encrypt the amount to withdraw
    console.log(`Encrypting ${amountToWithdraw}... `);
    const encryptedAmount = await fhenixjs.encrypt_uint32(amountToWithdraw);
    console.log(`Encrypted amount: ${amountToWithdraw}`, encryptedAmount);

    // load the FugaziCore contract with FugaziBalanceFacet abi
    const FugaziBalanceFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziBalanceFacetDeployment.abi,
      signer
    ) as unknown as FugaziBalanceFacet;

    // withdraw from Fugazi
    console.log(`Withdrawing ${amountToWithdraw} ${tokenName} from Fugazi...`);
    try {
      const tx = await FugaziBalanceFacet.withdraw(
        signer.address,
        tokenDeployment.address,
        encryptedAmount
      );
      console.log(
        `Withdrew ${amountToWithdraw} ${tokenName} from Fugazi. Tx hash:`,
        tx.hash
      );
    } catch (e) {
      console.error("Failed to withdraw from Fugazi:", e);
      return;
    }

    ///////////////////////////////////////////////////////////////
    //                  Balances after withdraw                  //
    ///////////////////////////////////////////////////////////////

    // check the encrypted balances in wallet after withdraw
    const encryptedBalanceAfter = await token.balanceOfEncrypted(
      signer.address,
      permitForToken
    );
    const decryptedBalanceAfter = fhenixjs.unseal(
      tokenDeployment.address,
      encryptedBalanceAfter
    );
    console.log(
      `Got decrypted balance in wallet after withdraw:`,
      decryptedBalanceAfter.toString()
    );

    // check the encrypted balance in Fugazi after withdraw
    const encryptedBalanceFugaziAfter = await FugaziViewerFacet.getBalance(
      tokenDeployment.address,
      permitForFugazi
    );
    const decryptedBalanceFugaziAfter = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalanceFugaziAfter
    );
    console.log(
      `Got decrypted balance in Fugazi after withdraw:`,
      decryptedBalanceFugaziAfter.toString()
    );
  });
