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
import type { NonPayableOverrides } from "../../../common";
import type {
  TokenDistributor,
  TokenDistributorInterface,
} from "../../../contracts/tokens/TokenDistributor";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct inEuint32",
        name: "amount",
        type: "tuple",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50610df1806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80631e83409a1461003b57806375e24ef714610057575b600080fd5b610055600480360381019061005091906107d4565b610073565b005b610071600480360381019061006c9190610825565b610261565b005b6000600160009054906101000a900460ff1660ff16146100c8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100bf90610904565b60405180910390fd5b60018060006101000a81548160ff021916908360ff16021790555060006101366000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546101316004610400565b610414565b90506101806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548261048d565b6000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff1663c4224c1933836040518363ffffffff1660e01b81526004016101fd929190610978565b6020604051808303816000875af115801561021c573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061024091906109cd565b50506000600160006101000a81548160ff021916908360ff16021790555050565b6000600160009054906101000a900460ff1660ff16146102b6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102ad90610904565b60405180910390fd5b60018060006101000a81548160ff021916908360ff16021790555060008273ffffffffffffffffffffffffffffffffffffffff16638624a3493330856040518463ffffffff1660e01b815260040161031093929190610afe565b6020604051808303816000875af115801561032f573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061035391906109cd565b905061039d6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054826104a1565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550506000600160006101000a81548160ff021916908360ff1602179055505050565b600061040d8260026104b5565b9050919050565b600061041f83610557565b6104305761042d6000610400565b92505b61043982610557565b61044a576104476000610400565b91505b60008390506000839050600061047f60028484608073ffffffffffffffffffffffffffffffffffffffff16639944d12d610564565b905080935050505092915050565b600061049983836105f8565b905092915050565b60006104ad8383610671565b905092915050565b60006060608073ffffffffffffffffffffffffffffffffffffffff166319e1c5c46104df866106e9565b856040518363ffffffff1660e01b81526004016104fd929190610bd7565b600060405180830381865afa15801561051a573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906105439190610d2d565b905061054e81610746565b91505092915050565b6000808214159050919050565b60006060838388610574896106e9565b61057d896106e9565b6040518463ffffffff1660e01b815260040161059b93929190610d76565b600060405180830381865afa1580156105b8573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906105e19190610d2d565b90506105ec81610754565b91505095945050505050565b600061060383610557565b610614576106116000610400565b92505b61061d82610557565b61062e5761062b6000610400565b91505b60008390506000839050600061066360028484608073ffffffffffffffffffffffffffffffffffffffff1663cc2cbeff610564565b905080935050505092915050565b600061067c83610557565b61068d5761068a6000610400565b92505b61069682610557565b6106a7576106a46000610400565b91505b6000839050600083905060006106db60028484608073ffffffffffffffffffffffffffffffffffffffff16622df619610564565b905080935050505092915050565b6060602067ffffffffffffffff81111561070657610705610c11565b5b6040519080825280601f01601f1916602001820160405280156107385781602001600182028036833780820191505090505b509050816020820152919050565b600060208201519050919050565b600060208201519050919050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006107a182610776565b9050919050565b6107b181610796565b81146107bc57600080fd5b50565b6000813590506107ce816107a8565b92915050565b6000602082840312156107ea576107e961076c565b5b60006107f8848285016107bf565b91505092915050565b600080fd5b60006020828403121561081c5761081b610801565b5b81905092915050565b6000806040838503121561083c5761083b61076c565b5b600061084a858286016107bf565b925050602083013567ffffffffffffffff81111561086b5761086a610771565b5b61087785828601610806565b9150509250929050565b600082825260208201905092915050565b7f49444b207768617420752061726520747279696e6720746f20646f206275742060008201527f646f6e277420646f206974000000000000000000000000000000000000000000602082015250565b60006108ee602b83610881565b91506108f982610892565b604082019050919050565b6000602082019050818103600083015261091d816108e1565b9050919050565b61092d81610796565b82525050565b6000819050919050565b6000819050919050565b600061096261095d61095884610933565b61093d565b610933565b9050919050565b61097281610947565b82525050565b600060408201905061098d6000830185610924565b61099a6020830184610969565b9392505050565b6109aa81610933565b81146109b557600080fd5b50565b6000815190506109c7816109a1565b92915050565b6000602082840312156109e3576109e261076c565b5b60006109f1848285016109b8565b91505092915050565b600080fd5b600080fd5b600080fd5b60008083356001602003843603038112610a2657610a25610a04565b5b83810192508235915060208301925067ffffffffffffffff821115610a4e57610a4d6109fa565b5b600182023603831315610a6457610a636109ff565b5b509250929050565b600082825260208201905092915050565b82818337600083830152505050565b6000601f19601f8301169050919050565b6000610aa98385610a6c565b9350610ab6838584610a7d565b610abf83610a8c565b840190509392505050565b600060208301610add6000840184610a09565b8583036000870152610af0838284610a9d565b925050508091505092915050565b6000606082019050610b136000830186610924565b610b206020830185610924565b8181036040830152610b328184610aca565b9050949350505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610b76578082015181840152602081019050610b5b565b60008484015250505050565b6000610b8d82610b3c565b610b978185610b47565b9350610ba7818560208601610b58565b610bb081610a8c565b840191505092915050565b600060ff82169050919050565b610bd181610bbb565b82525050565b60006040820190508181036000830152610bf18185610b82565b9050610c006020830184610bc8565b9392505050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610c4982610a8c565b810181811067ffffffffffffffff82111715610c6857610c67610c11565b5b80604052505050565b6000610c7b610762565b9050610c878282610c40565b919050565b600067ffffffffffffffff821115610ca757610ca6610c11565b5b610cb082610a8c565b9050602081019050919050565b6000610cd0610ccb84610c8c565b610c71565b905082815260208101848484011115610cec57610ceb610c0c565b5b610cf7848285610b58565b509392505050565b600082601f830112610d1457610d13610c07565b5b8151610d24848260208601610cbd565b91505092915050565b600060208284031215610d4357610d4261076c565b5b600082015167ffffffffffffffff811115610d6157610d60610771565b5b610d6d84828501610cff565b91505092915050565b6000606082019050610d8b6000830186610bc8565b8181036020830152610d9d8185610b82565b90508181036040830152610db18184610b82565b905094935050505056fea2646970667358221220e2c997af62a491a48be43ccbcde34e2323152d06b13e8c9f857044d89317715d64736f6c63430008180033";

type TokenDistributorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenDistributorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TokenDistributor__factory extends ContractFactory {
  constructor(...args: TokenDistributorConstructorParams) {
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
      TokenDistributor & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): TokenDistributor__factory {
    return super.connect(runner) as TokenDistributor__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenDistributorInterface {
    return new Interface(_abi) as TokenDistributorInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): TokenDistributor {
    return new Contract(address, _abi, runner) as unknown as TokenDistributor;
  }
}
