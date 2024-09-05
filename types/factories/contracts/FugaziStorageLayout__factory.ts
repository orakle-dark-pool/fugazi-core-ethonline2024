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
    name: "BatchIsInSettlement",
    type: "error",
  },
  {
    inputs: [],
    name: "EpochNotEnded",
    type: "error",
  },
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
    name: "NotValidSettlementStep",
    type: "error",
  },
  {
    inputs: [],
    name: "OrderAlreadyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "PoolAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "PoolNotFound",
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
    name: "TooEarlyHarvest",
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
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
    ],
    name: "Donation",
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
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
    ],
    name: "Harvest",
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
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "epoch",
        type: "uint32",
      },
    ],
    name: "batchSettled",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "epoch",
        type: "uint32",
      },
    ],
    name: "liquidityRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "epoch",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "claimer",
        type: "address",
      },
    ],
    name: "orderClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "epoch",
        type: "uint32",
      },
    ],
    name: "orderSubmitted",
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
  "0x6101606040526000600760006101000a81548160ff0219169083151502179055503480156200002d57600080fd5b506040518060400160405280601181526020017f4668656e6978205065726d697373696f6e0000000000000000000000000000008152506040518060400160405280600381526020017f312e300000000000000000000000000000000000000000000000000000000000815250620000b06000836200015060201b90919060201c565b6101208181525050620000ce6001826200015060201b90919060201c565b6101408181525050818051906020012060e08181525050808051906020012061010081815250504660a081815250506200010d620001a860201b60201c565b608081815250503073ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff1681525050505062000800565b600060208351101562000176576200016e836200020560201b60201c565b9050620001a2565b8262000188836200027260201b60201c565b6000019081620001999190620004f6565b5060ff60001b90505b92915050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60e051610100514630604051602001620001ea9594939291906200064e565b60405160208183030381529060405280519060200120905090565b600080829050601f815111156200025557826040517f305a27a90000000000000000000000000000000000000000000000000000000081526004016200024c91906200073a565b60405180910390fd5b805181620002639062000790565b60001c1760001b915050919050565b6000819050919050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620002fe57607f821691505b602082108103620003145762000313620002b6565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200037e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826200033f565b6200038a86836200033f565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620003d7620003d1620003cb84620003a2565b620003ac565b620003a2565b9050919050565b6000819050919050565b620003f383620003b6565b6200040b6200040282620003de565b8484546200034c565b825550505050565b600090565b6200042262000413565b6200042f818484620003e8565b505050565b5b8181101562000457576200044b60008262000418565b60018101905062000435565b5050565b601f821115620004a65762000470816200031a565b6200047b846200032f565b810160208510156200048b578190505b620004a36200049a856200032f565b83018262000434565b50505b505050565b600082821c905092915050565b6000620004cb60001984600802620004ab565b1980831691505092915050565b6000620004e68383620004b8565b9150826002028217905092915050565b62000501826200027c565b67ffffffffffffffff8111156200051d576200051c62000287565b5b620005298254620002e5565b620005368282856200045b565b600060209050601f8311600181146200056e576000841562000559578287015190505b620005658582620004d8565b865550620005d5565b601f1984166200057e866200031a565b60005b82811015620005a85784890151825560018201915060208501945060208101905062000581565b86831015620005c85784890151620005c4601f891682620004b8565b8355505b6001600288020188555050505b505050505050565b6000819050919050565b620005f281620005dd565b82525050565b6200060381620003a2565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620006368262000609565b9050919050565b620006488162000629565b82525050565b600060a082019050620006656000830188620005e7565b620006746020830187620005e7565b620006836040830186620005e7565b620006926060830185620005f8565b620006a160808301846200063d565b9695505050505050565b600082825260208201905092915050565b60005b83811015620006dc578082015181840152602081019050620006bf565b60008484015250505050565b6000601f19601f8301169050919050565b600062000706826200027c565b620007128185620006ab565b935062000724818560208601620006bc565b6200072f81620006e8565b840191505092915050565b60006020820190508181036000830152620007568184620006f9565b905092915050565b600081519050919050565b6000819050602082019050919050565b6000620007878251620005dd565b80915050919050565b60006200079d826200075e565b82620007a98462000769565b9050620007b68162000779565b92506020821015620007f957620007f47fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff836020036008026200033f565b831692505b5050919050565b60805160a05160c05160e05161010051610120516101405161062d6200084c6000396000610142015260006101070152600050506000505060005050600050506000505061062d6000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806384b0196e14610030575b600080fd5b610038610054565b60405161004b97969594939291906104e4565b60405180910390f35b6000606080600080600060606100686100fe565b610070610139565b46306000801b600067ffffffffffffffff81111561009157610090610568565b5b6040519080825280602002602001820160405280156100bf5781602001602082028036833780820191505090505b507f0f00000000000000000000000000000000000000000000000000000000000000959493929190965096509650965096509650965090919293949596565b606061013460007f000000000000000000000000000000000000000000000000000000000000000061017490919063ffffffff16565b905090565b606061016f60017f000000000000000000000000000000000000000000000000000000000000000061017490919063ffffffff16565b905090565b606060ff60001b83146101915761018a83610224565b905061021e565b81805461019d906105c6565b80601f01602080910402602001604051908101604052809291908181526020018280546101c9906105c6565b80156102165780601f106101eb57610100808354040283529160200191610216565b820191906000526020600020905b8154815290600101906020018083116101f957829003601f168201915b505050505090505b92915050565b6060600061023183610298565b90506000602067ffffffffffffffff8111156102505761024f610568565b5b6040519080825280601f01601f1916602001820160405280156102825781602001600182028036833780820191505090505b5090508181528360208201528092505050919050565b60008060ff8360001c169050601f8111156102df576040517fb3512b0c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80915050919050565b60007fff0000000000000000000000000000000000000000000000000000000000000082169050919050565b61031d816102e8565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561035d578082015181840152602081019050610342565b60008484015250505050565b6000601f19601f8301169050919050565b600061038582610323565b61038f818561032e565b935061039f81856020860161033f565b6103a881610369565b840191505092915050565b6000819050919050565b6103c6816103b3565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006103f7826103cc565b9050919050565b610407816103ec565b82525050565b6000819050919050565b6104208161040d565b82525050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b61045b816103b3565b82525050565b600061046d8383610452565b60208301905092915050565b6000602082019050919050565b600061049182610426565b61049b8185610431565b93506104a683610442565b8060005b838110156104d75781516104be8882610461565b97506104c983610479565b9250506001810190506104aa565b5085935050505092915050565b600060e0820190506104f9600083018a610314565b818103602083015261050b818961037a565b9050818103604083015261051f818861037a565b905061052e60608301876103bd565b61053b60808301866103fe565b61054860a0830185610417565b81810360c083015261055a8184610486565b905098975050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806105de57607f821691505b6020821081036105f1576105f0610597565b5b5091905056fea2646970667358221220c861a249cb826d11a5cf1eccc2cc956b79ba77f69ccbb57dbfe9d50a40c94c7064736f6c63430008180033";

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
