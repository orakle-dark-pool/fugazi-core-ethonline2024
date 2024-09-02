import {
  FugaziBalanceFacet,
  FugaziViewerFacet,
  FHERC20Mintable,
} from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import chalk from "chalk";

task("task:deposit")
  .addParam("name", "Name of the token to deposit", "FakeFGZ")
  .addParam("amount", "Amount to deposit", "1")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();
    const amountToDeposit = Number(taskArguments.amount);
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
        `Running deposit: depositting ${amountToDeposit} ${tokenName} to Fugazi`
      )
    );

    ///////////////////////////////////////////////////////////////
    //                  Balances before deposit                  //
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

    // check the encrypted balances in wallet before deposit
    const encryptedBalanceBefore = await token.balanceOfEncrypted(
      signer.address,
      permitForToken
    );
    const decryptedBalanceBefore = fhenixjs.unseal(
      tokenDeployment.address,
      encryptedBalanceBefore
    );
    console.log(
      `Got decrypted balance in wallet before deposit:`,
      decryptedBalanceBefore.toString()
    );

    // check the encrypted balance in Fugazi before deposit
    const encryptedBalanceFugaziBefore = await FugaziViewerFacet.getBalance(
      tokenDeployment.address,
      permitForFugazi
    );
    const decryptedBalanceFugaziBefore = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalanceFugaziBefore
    );
    console.log(
      `Got decrypted balance in Fugazi before deposit:`,
      decryptedBalanceFugaziBefore.toString()
    );

    ///////////////////////////////////////////////////////////////
    //                     Deposit to Fugazi                     //
    ///////////////////////////////////////////////////////////////

    // encrypt the amount to deposit
    console.log(`Encrypting ${amountToDeposit}... `);
    const encryptedAmount = await fhenixjs.encrypt_uint32(amountToDeposit);
    console.log(`Encrypted ${amountToDeposit}:`, encryptedAmount);

    // approve token to Fugazi
    console.log(`Approving ${amountToDeposit} ${tokenName} to Fugazi... `);
    try {
      const tx = await token.approveEncrypted(
        FugaziCoreDeployment.address,
        encryptedAmount
      );
      console.log(
        `Approved ${amountToDeposit} ${tokenName} to Fugazi. tx hash:`,
        tx.hash
      );
    } catch (e) {
      console.log(`Failed to approve token to Fugazi: ${e}`);
      return;
    }

    // load the FugaziCore contract with FugaziBalanceFacet abi
    const FugaziBalanceFacet = new ethers.Contract(
      FugaziCoreDeployment.address,
      FugaziBalanceFacetDeployment.abi,
      signer
    ) as unknown as FugaziBalanceFacet;

    // deposit to Fugazi
    console.log(`Depositing ${amountToDeposit} ${tokenName} to Fugazi... `);
    try {
      const tx = await FugaziBalanceFacet.deposit(
        signer.address,
        tokenDeployment.address,
        encryptedAmount
      );
      console.log(
        `Deposited ${amountToDeposit} ${tokenName} to Fugazi. tx hash:`,
        tx.hash
      );
    } catch (e) {
      console.log(`Failed to deposit token to Fugazi: ${e}`);
      return;
    }

    ///////////////////////////////////////////////////////////////
    //                  Balances after deposit                   //
    ///////////////////////////////////////////////////////////////

    // check the encrypted balances in wallet after deposit
    const encryptedBalanceAfter = await token.balanceOfEncrypted(
      signer.address,
      permitForToken
    );
    const decryptedBalanceAfter = fhenixjs.unseal(
      tokenDeployment.address,
      encryptedBalanceAfter
    );
    console.log(
      `Got decrypted balance in wallet after deposit:`,
      decryptedBalanceAfter.toString()
    );

    // check the encrypted balance in Fugazi after deposit
    const encryptedBalanceFugaziAfter = await FugaziViewerFacet.getBalance(
      tokenDeployment.address,
      permitForFugazi
    );
    const decryptedBalanceFugaziAfter = fhenixjs.unseal(
      FugaziCoreDeployment.address,
      encryptedBalanceFugaziAfter
    );
    console.log(
      `Got decrypted balance in Fugazi after deposit:`,
      decryptedBalanceFugaziAfter.toString()
    );
  });
