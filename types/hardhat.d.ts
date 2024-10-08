/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Permissioned",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Permissioned__factory>;
    getContractFactory(
      name: "FHE",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FHE__factory>;
    getContractFactory(
      name: "FheOps",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FheOps__factory>;
    getContractFactory(
      name: "Precompiles",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Precompiles__factory>;
    getContractFactory(
      name: "IERC5267",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC5267__factory>;
    getContractFactory(
      name: "ECDSA",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ECDSA__factory>;
    getContractFactory(
      name: "EIP712",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EIP712__factory>;
    getContractFactory(
      name: "Math",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Math__factory>;
    getContractFactory(
      name: "ShortStrings",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ShortStrings__factory>;
    getContractFactory(
      name: "Strings",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Strings__factory>;
    getContractFactory(
      name: "FugaziBalanceFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FugaziBalanceFacet__factory>;
    getContractFactory(
      name: "FugaziCore",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FugaziCore__factory>;
    getContractFactory(
      name: "FugaziOrderFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FugaziOrderFacet__factory>;
    getContractFactory(
      name: "FugaziPoolActionFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FugaziPoolActionFacet__factory>;
    getContractFactory(
      name: "FugaziPoolRegistryFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FugaziPoolRegistryFacet__factory>;
    getContractFactory(
      name: "FugaziStorageLayout",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FugaziStorageLayout__factory>;
    getContractFactory(
      name: "FugaziViewerFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FugaziViewerFacet__factory>;
    getContractFactory(
      name: "IFHERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFHERC20__factory>;
    getContractFactory(
      name: "Counter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Counter__factory>;
    getContractFactory(
      name: "FakeEUR",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FakeEUR__factory>;
    getContractFactory(
      name: "FakeFGZ",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FakeFGZ__factory>;
    getContractFactory(
      name: "FakeUSD",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FakeUSD__factory>;
    getContractFactory(
      name: "FHERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FHERC20__factory>;
    getContractFactory(
      name: "FHERC20Mintable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.FHERC20Mintable__factory>;
    getContractFactory(
      name: "TokenDistributor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenDistributor__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;

    getContractAt(
      name: "Permissioned",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Permissioned>;
    getContractAt(
      name: "FHE",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FHE>;
    getContractAt(
      name: "FheOps",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FheOps>;
    getContractAt(
      name: "Precompiles",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Precompiles>;
    getContractAt(
      name: "IERC5267",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC5267>;
    getContractAt(
      name: "ECDSA",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ECDSA>;
    getContractAt(
      name: "EIP712",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.EIP712>;
    getContractAt(
      name: "Math",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Math>;
    getContractAt(
      name: "ShortStrings",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ShortStrings>;
    getContractAt(
      name: "Strings",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Strings>;
    getContractAt(
      name: "FugaziBalanceFacet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FugaziBalanceFacet>;
    getContractAt(
      name: "FugaziCore",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FugaziCore>;
    getContractAt(
      name: "FugaziOrderFacet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FugaziOrderFacet>;
    getContractAt(
      name: "FugaziPoolActionFacet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FugaziPoolActionFacet>;
    getContractAt(
      name: "FugaziPoolRegistryFacet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FugaziPoolRegistryFacet>;
    getContractAt(
      name: "FugaziStorageLayout",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FugaziStorageLayout>;
    getContractAt(
      name: "FugaziViewerFacet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FugaziViewerFacet>;
    getContractAt(
      name: "IFHERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IFHERC20>;
    getContractAt(
      name: "Counter",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Counter>;
    getContractAt(
      name: "FakeEUR",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FakeEUR>;
    getContractAt(
      name: "FakeFGZ",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FakeFGZ>;
    getContractAt(
      name: "FakeUSD",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FakeUSD>;
    getContractAt(
      name: "FHERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FHERC20>;
    getContractAt(
      name: "FHERC20Mintable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.FHERC20Mintable>;
    getContractAt(
      name: "TokenDistributor",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TokenDistributor>;
    getContractAt(
      name: "ERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;

    deployContract(
      name: "Permissioned",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Permissioned>;
    deployContract(
      name: "FHE",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FHE>;
    deployContract(
      name: "FheOps",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FheOps>;
    deployContract(
      name: "Precompiles",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Precompiles>;
    deployContract(
      name: "IERC5267",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC5267>;
    deployContract(
      name: "ECDSA",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ECDSA>;
    deployContract(
      name: "EIP712",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.EIP712>;
    deployContract(
      name: "Math",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Math>;
    deployContract(
      name: "ShortStrings",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ShortStrings>;
    deployContract(
      name: "Strings",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strings>;
    deployContract(
      name: "FugaziBalanceFacet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziBalanceFacet>;
    deployContract(
      name: "FugaziCore",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziCore>;
    deployContract(
      name: "FugaziOrderFacet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziOrderFacet>;
    deployContract(
      name: "FugaziPoolActionFacet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziPoolActionFacet>;
    deployContract(
      name: "FugaziPoolRegistryFacet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziPoolRegistryFacet>;
    deployContract(
      name: "FugaziStorageLayout",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziStorageLayout>;
    deployContract(
      name: "FugaziViewerFacet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziViewerFacet>;
    deployContract(
      name: "IFHERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IFHERC20>;
    deployContract(
      name: "Counter",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Counter>;
    deployContract(
      name: "FakeEUR",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FakeEUR>;
    deployContract(
      name: "FakeFGZ",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FakeFGZ>;
    deployContract(
      name: "FakeUSD",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FakeUSD>;
    deployContract(
      name: "FHERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FHERC20>;
    deployContract(
      name: "FHERC20Mintable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FHERC20Mintable>;
    deployContract(
      name: "TokenDistributor",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenDistributor>;
    deployContract(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;

    deployContract(
      name: "Permissioned",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Permissioned>;
    deployContract(
      name: "FHE",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FHE>;
    deployContract(
      name: "FheOps",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FheOps>;
    deployContract(
      name: "Precompiles",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Precompiles>;
    deployContract(
      name: "IERC5267",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC5267>;
    deployContract(
      name: "ECDSA",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ECDSA>;
    deployContract(
      name: "EIP712",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.EIP712>;
    deployContract(
      name: "Math",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Math>;
    deployContract(
      name: "ShortStrings",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ShortStrings>;
    deployContract(
      name: "Strings",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strings>;
    deployContract(
      name: "FugaziBalanceFacet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziBalanceFacet>;
    deployContract(
      name: "FugaziCore",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziCore>;
    deployContract(
      name: "FugaziOrderFacet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziOrderFacet>;
    deployContract(
      name: "FugaziPoolActionFacet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziPoolActionFacet>;
    deployContract(
      name: "FugaziPoolRegistryFacet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziPoolRegistryFacet>;
    deployContract(
      name: "FugaziStorageLayout",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziStorageLayout>;
    deployContract(
      name: "FugaziViewerFacet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FugaziViewerFacet>;
    deployContract(
      name: "IFHERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IFHERC20>;
    deployContract(
      name: "Counter",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Counter>;
    deployContract(
      name: "FakeEUR",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FakeEUR>;
    deployContract(
      name: "FakeFGZ",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FakeFGZ>;
    deployContract(
      name: "FakeUSD",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FakeUSD>;
    deployContract(
      name: "FHERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FHERC20>;
    deployContract(
      name: "FHERC20Mintable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.FHERC20Mintable>;
    deployContract(
      name: "TokenDistributor",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenDistributor>;
    deployContract(
      name: "ERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
