/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  FugaziStorageLayout,
  FugaziStorageLayoutInterface,
} from "../../contracts/FugaziStorageLayout";

const _abi = [
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenOrder",
    type: "error",
  },
  {
    inputs: [],
    name: "PoolAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "SignerNotMessageSender",
    type: "error",
  },
  {
    inputs: [],
    name: "SignerNotOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    name: "StringTooLong",
    type: "error",
  },
  {
    inputs: [],
    name: "noCorrespondingFacet",
    type: "error",
  },
  {
    inputs: [],
    name: "notOwner",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenX",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenY",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
    ],
    name: "PoolCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "address",
        name: "facet",
        type: "address",
      },
    ],
    name: "facetAdded",
    type: "event",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6101606040523480156200001257600080fd5b506040518060400160405280601181526020017f4668656e6978205065726d697373696f6e0000000000000000000000000000008152506040518060400160405280600381526020017f312e300000000000000000000000000000000000000000000000000000000000815250620000956000836200013560201b90919060201c565b6101208181525050620000b36001826200013560201b90919060201c565b6101408181525050818051906020012060e08181525050808051906020012061010081815250504660a08181525050620000f26200018d60201b60201c565b608081815250503073ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff16815250505050620007e5565b60006020835110156200015b576200015383620001ea60201b60201c565b905062000187565b826200016d836200025760201b60201c565b60000190816200017e9190620004db565b5060ff60001b90505b92915050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60e051610100514630604051602001620001cf95949392919062000633565b60405160208183030381529060405280519060200120905090565b600080829050601f815111156200023a57826040517f305a27a90000000000000000000000000000000000000000000000000000000081526004016200023191906200071f565b60405180910390fd5b805181620002489062000775565b60001c1760001b915050919050565b6000819050919050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620002e357607f821691505b602082108103620002f957620002f86200029b565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620003637fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000324565b6200036f868362000324565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620003bc620003b6620003b08462000387565b62000391565b62000387565b9050919050565b6000819050919050565b620003d8836200039b565b620003f0620003e782620003c3565b84845462000331565b825550505050565b600090565b62000407620003f8565b62000414818484620003cd565b505050565b5b818110156200043c5762000430600082620003fd565b6001810190506200041a565b5050565b601f8211156200048b576200045581620002ff565b620004608462000314565b8101602085101562000470578190505b620004886200047f8562000314565b83018262000419565b50505b505050565b600082821c905092915050565b6000620004b06000198460080262000490565b1980831691505092915050565b6000620004cb83836200049d565b9150826002028217905092915050565b620004e68262000261565b67ffffffffffffffff8111156200050257620005016200026c565b5b6200050e8254620002ca565b6200051b82828562000440565b600060209050601f8311600181146200055357600084156200053e578287015190505b6200054a8582620004bd565b865550620005ba565b601f1984166200056386620002ff565b60005b828110156200058d5784890151825560018201915060208501945060208101905062000566565b86831015620005ad5784890151620005a9601f8916826200049d565b8355505b6001600288020188555050505b505050505050565b6000819050919050565b620005d781620005c2565b82525050565b620005e88162000387565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200061b82620005ee565b9050919050565b6200062d816200060e565b82525050565b600060a0820190506200064a6000830188620005cc565b620006596020830187620005cc565b620006686040830186620005cc565b620006776060830185620005dd565b62000686608083018462000622565b9695505050505050565b600082825260208201905092915050565b60005b83811015620006c1578082015181840152602081019050620006a4565b60008484015250505050565b6000601f19601f8301169050919050565b6000620006eb8262000261565b620006f7818562000690565b935062000709818560208601620006a1565b6200071481620006cd565b840191505092915050565b600060208201905081810360008301526200073b8184620006de565b905092915050565b600081519050919050565b6000819050602082019050919050565b60006200076c8251620005c2565b80915050919050565b6000620007828262000743565b826200078e846200074e565b90506200079b816200075e565b92506020821015620007de57620007d97fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8360200360080262000324565b831692505b5050919050565b60805160a05160c05160e05161010051610120516101405161062d620008316000396000610142015260006101070152600050506000505060005050600050506000505061062d6000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806384b0196e14610030575b600080fd5b610038610054565b60405161004b97969594939291906104e4565b60405180910390f35b6000606080600080600060606100686100fe565b610070610139565b46306000801b600067ffffffffffffffff81111561009157610090610568565b5b6040519080825280602002602001820160405280156100bf5781602001602082028036833780820191505090505b507f0f00000000000000000000000000000000000000000000000000000000000000959493929190965096509650965096509650965090919293949596565b606061013460007f000000000000000000000000000000000000000000000000000000000000000061017490919063ffffffff16565b905090565b606061016f60017f000000000000000000000000000000000000000000000000000000000000000061017490919063ffffffff16565b905090565b606060ff60001b83146101915761018a83610224565b905061021e565b81805461019d906105c6565b80601f01602080910402602001604051908101604052809291908181526020018280546101c9906105c6565b80156102165780601f106101eb57610100808354040283529160200191610216565b820191906000526020600020905b8154815290600101906020018083116101f957829003601f168201915b505050505090505b92915050565b6060600061023183610298565b90506000602067ffffffffffffffff8111156102505761024f610568565b5b6040519080825280601f01601f1916602001820160405280156102825781602001600182028036833780820191505090505b5090508181528360208201528092505050919050565b60008060ff8360001c169050601f8111156102df576040517fb3512b0c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80915050919050565b60007fff0000000000000000000000000000000000000000000000000000000000000082169050919050565b61031d816102e8565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561035d578082015181840152602081019050610342565b60008484015250505050565b6000601f19601f8301169050919050565b600061038582610323565b61038f818561032e565b935061039f81856020860161033f565b6103a881610369565b840191505092915050565b6000819050919050565b6103c6816103b3565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006103f7826103cc565b9050919050565b610407816103ec565b82525050565b6000819050919050565b6104208161040d565b82525050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b61045b816103b3565b82525050565b600061046d8383610452565b60208301905092915050565b6000602082019050919050565b600061049182610426565b61049b8185610431565b93506104a683610442565b8060005b838110156104d75781516104be8882610461565b97506104c983610479565b9250506001810190506104aa565b5085935050505092915050565b600060e0820190506104f9600083018a610314565b818103602083015261050b818961037a565b9050818103604083015261051f818861037a565b905061052e60608301876103bd565b61053b60808301866103fe565b61054860a0830185610417565b81810360c083015261055a8184610486565b905098975050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806105de57607f821691505b6020821081036105f1576105f0610597565b5b5091905056fea264697066735822122040c454de5fa5ce314164eeda70329f77565660269c2383043e7a7329ed4ce3fc64736f6c63430008180033";

type FugaziStorageLayoutConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FugaziStorageLayoutConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FugaziStorageLayout__factory extends ContractFactory {
  constructor(...args: FugaziStorageLayoutConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      FugaziStorageLayout & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): FugaziStorageLayout__factory {
    return super.connect(runner) as FugaziStorageLayout__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FugaziStorageLayoutInterface {
    return new Interface(_abi) as FugaziStorageLayoutInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): FugaziStorageLayout {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as FugaziStorageLayout;
  }
}
