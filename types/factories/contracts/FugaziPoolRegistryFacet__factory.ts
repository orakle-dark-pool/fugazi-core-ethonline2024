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
  FugaziPoolRegistryFacet,
  FugaziPoolRegistryFacetInterface,
} from "../../contracts/FugaziPoolRegistryFacet";

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
    inputs: [
      {
        internalType: "address",
        name: "tokenX",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenY",
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
        name: "_initialReserves",
        type: "tuple",
      },
    ],
    name: "createPool",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
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
  "0x6101606040523480156200001257600080fd5b506040518060400160405280601181526020017f4668656e6978205065726d697373696f6e0000000000000000000000000000008152506040518060400160405280600381526020017f312e300000000000000000000000000000000000000000000000000000000000815250620000956000836200013560201b90919060201c565b6101208181525050620000b36001826200013560201b90919060201c565b6101408181525050818051906020012060e08181525050808051906020012061010081815250504660a08181525050620000f26200018d60201b60201c565b608081815250503073ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff16815250505050620007e5565b60006020835110156200015b576200015383620001ea60201b60201c565b905062000187565b826200016d836200025760201b60201c565b60000190816200017e9190620004db565b5060ff60001b90505b92915050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60e051610100514630604051602001620001cf95949392919062000633565b60405160208183030381529060405280519060200120905090565b600080829050601f815111156200023a57826040517f305a27a90000000000000000000000000000000000000000000000000000000081526004016200023191906200071f565b60405180910390fd5b805181620002489062000775565b60001c1760001b915050919050565b6000819050919050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620002e357607f821691505b602082108103620002f957620002f86200029b565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620003637fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000324565b6200036f868362000324565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620003bc620003b6620003b08462000387565b62000391565b62000387565b9050919050565b6000819050919050565b620003d8836200039b565b620003f0620003e782620003c3565b84845462000331565b825550505050565b600090565b62000407620003f8565b62000414818484620003cd565b505050565b5b818110156200043c5762000430600082620003fd565b6001810190506200041a565b5050565b601f8211156200048b576200045581620002ff565b620004608462000314565b8101602085101562000470578190505b620004886200047f8562000314565b83018262000419565b50505b505050565b600082821c905092915050565b6000620004b06000198460080262000490565b1980831691505092915050565b6000620004cb83836200049d565b9150826002028217905092915050565b620004e68262000261565b67ffffffffffffffff8111156200050257620005016200026c565b5b6200050e8254620002ca565b6200051b82828562000440565b600060209050601f8311600181146200055357600084156200053e578287015190505b6200054a8582620004bd565b865550620005ba565b601f1984166200056386620002ff565b60005b828110156200058d5784890151825560018201915060208501945060208101905062000566565b86831015620005ad5784890151620005a9601f8916826200049d565b8355505b6001600288020188555050505b505050505050565b6000819050919050565b620005d781620005c2565b82525050565b620005e88162000387565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200061b82620005ee565b9050919050565b6200062d816200060e565b82525050565b600060a0820190506200064a6000830188620005cc565b620006596020830187620005cc565b620006686040830186620005cc565b620006776060830185620005dd565b62000686608083018462000622565b9695505050505050565b600082825260208201905092915050565b60005b83811015620006c1578082015181840152602081019050620006a4565b60008484015250505050565b6000601f19601f8301169050919050565b6000620006eb8262000261565b620006f7818562000690565b935062000709818560208601620006a1565b6200071481620006cd565b840191505092915050565b600060208201905081810360008301526200073b8184620006de565b905092915050565b600081519050919050565b6000819050602082019050919050565b60006200076c8251620005c2565b80915050919050565b6000620007828262000743565b826200078e846200074e565b90506200079b816200075e565b92506020821015620007de57620007d97fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8360200360080262000324565b831692505b5050919050565b60805160a05160c05160e051610100516101205161014051611b6d620008316000396000610d9601526000610d5b01526000505060005050600050506000505060005050611b6d6000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063467276391461003b57806384b0196e1461006b575b600080fd5b610055600480360381019061005091906113db565b61008f565b6040516100629190611463565b60405180910390f35b6100736105af565b604051610086979695949392919061162f565b60405180910390f35b60008373ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16116100f6576040517f3f06bf8100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60006101028585610659565b90506000801b8114610140576040517f0311932200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60006101548461014f9061184a565b610796565b905060006101e4600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006101a88a6107ac565b8152602001908152602001600020546101df6101d0856101cb633fff80006107cc565b6107e0565b6101da600f6107cc565b610859565b6108d2565b90506000610260600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006102388a6107ac565b81526020019081526020016000205461025b85610256617fff6107cc565b6107e0565b6108d2565b90506102ac6102a761028584610280600a63ffffffff166002901b6107cc565b61094b565b6102a28461029d600a63ffffffff166002901b6107cc565b61094b565b6109c4565b610a3d565b610311600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006102fc8b6107ac565b81526020019081526020016000205483610af2565b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001600061035e8b6107ac565b8152602001908152602001600020819055506103d5600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006103c08a6107ac565b81526020019081526020016000205482610af2565b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160006104228a6107ac565b81526020019081526020016000208190555087876040516020016104479291906118a5565b60405160208183030381529060405280519060200120600560008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506104e78888610659565b93506000600660008681526020019081526020016000209050600060405180608001604052808b73ffffffffffffffffffffffffffffffffffffffff1681526020018a73ffffffffffffffffffffffffffffffffffffffff16815260200185815260200184815250905061055c868383610b06565b7fec5dc6309c83a50f60f4a1fae9422b2c406da78c579b9b12b92d033db37c71948160000151826020015188604051610597939291906118d1565b60405180910390a18596505050505050509392505050565b6000606080600080600060606105c3610d52565b6105cb610d8d565b46306000801b600067ffffffffffffffff8111156105ec576105eb6116b8565b5b60405190808252806020026020018201604052801561061a5781602001602082028036833780820191505090505b507f0f00000000000000000000000000000000000000000000000000000000000000959493929190965096509650965096509650965090919293949596565b60008173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161061071057600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461078e565b600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020545b905092915050565b60006107a58260000151610dc8565b9050919050565b600060608260601b6bffffffffffffffffffffffff1916901c9050919050565b60006107d9826002610ddc565b9050919050565b60006107eb83610e7e565b6107fc576107f960006107cc565b92505b61080582610e7e565b6108165761081360006107cc565b91505b60008390506000839050600061084b60028484608073ffffffffffffffffffffffffffffffffffffffff1663ae104cfd610e8b565b905080935050505092915050565b600061086483610e7e565b6108755761087260006107cc565b92505b61087e82610e7e565b61088f5761088c60006107cc565b91505b6000839050600083905060006108c460028484608073ffffffffffffffffffffffffffffffffffffffff16639944d12d610e8b565b905080935050505092915050565b60006108dd83610e7e565b6108ee576108eb60006107cc565b92505b6108f782610e7e565b6109085761090560006107cc565b91505b60008390506000839050600061093d60028484608073ffffffffffffffffffffffffffffffffffffffff16635211c679610e8b565b905080935050505092915050565b600061095683610e7e565b6109675761096460006107cc565b92505b61097082610e7e565b6109815761097e60006107cc565b91505b6000839050600083905060006109b660028484608073ffffffffffffffffffffffffffffffffffffffff1663874b1c10610e8b565b905080935050505092915050565b60006109cf83610f1f565b6109e0576109dd6000610f2c565b92505b6109e982610f1f565b6109fa576109f76000610f2c565b91505b600083905060008390506000610a2f600d8484608073ffffffffffffffffffffffffffffffffffffffff1663ae104cfd610e8b565b905080935050505092915050565b610a4681610f1f565b610a5757610a546000610f2c565b90505b60008190506000610a6782610f40565b9050608073ffffffffffffffffffffffffffffffffffffffff16637d23f1db600d836040518363ffffffff1660e01b8152600401610aa6929190611979565b600060405180830381865afa158015610ac3573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250810190610aec9190611a19565b50505050565b6000610afe8383610f9d565b905092915050565b80600001518260000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080602001518260010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008260010160146101000a81548163ffffffff021916908363ffffffff160217905550428260010160186101000a81548163ffffffff021916908363ffffffff1602179055508060400151826004018190555080606001518260050181905550610c0782600401548360050154611016565b8260060181905550610c3e610c2f8360060154610c2a600a63ffffffff166107cc565b610859565b610c3960016107cc565b61108f565b600460003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001600085815260200190815260200160002081905550610cf68260060154600460003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001600086815260200190815260200160002054610af2565b600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001600085815260200190815260200160002081905550505050565b6060610d8860007f00000000000000000000000000000000000000000000000000000000000000006110a390919063ffffffff16565b905090565b6060610dc360017f00000000000000000000000000000000000000000000000000000000000000006110a390919063ffffffff16565b905090565b6000610dd5826002611153565b9050919050565b60006060608073ffffffffffffffffffffffffffffffffffffffff166319e1c5c4610e0686610f40565b856040518363ffffffff1660e01b8152600401610e24929190611a62565b600060405180830381865afa158015610e41573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250810190610e6a9190611a19565b9050610e75816111ed565b91505092915050565b6000808214159050919050565b60006060838388610e9b89610f40565b610ea489610f40565b6040518463ffffffff1660e01b8152600401610ec293929190611a92565b600060405180830381865afa158015610edf573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250810190610f089190611a19565b9050610f13816111fb565b91505095945050505050565b6000808214159050919050565b6000610f3982600d610ddc565b9050919050565b6060602067ffffffffffffffff811115610f5d57610f5c6116b8565b5b6040519080825280601f01601f191660200182016040528015610f8f5781602001600182028036833780820191505090505b509050816020820152919050565b6000610fa883610e7e565b610fb957610fb660006107cc565b92505b610fc282610e7e565b610fd357610fd060006107cc565b91505b60008390506000839050600061100860028484608073ffffffffffffffffffffffffffffffffffffffff1663cc2cbeff610e8b565b905080935050505092915050565b600061102183610e7e565b6110325761102f60006107cc565b92505b61103b82610e7e565b61104c5761104960006107cc565b91505b60008390506000839050600061108160028484608073ffffffffffffffffffffffffffffffffffffffff16630b80518e610e8b565b905080935050505092915050565b600061109b8383611209565b905092915050565b606060ff60001b83146110c0576110b983611281565b905061114d565b8180546110cc90611b06565b80601f01602080910402602001604051908101604052809291908181526020018280546110f890611b06565b80156111455780601f1061111a57610100808354040283529160200191611145565b820191906000526020600020905b81548152906001019060200180831161112857829003601f168201915b505050505090505b92915050565b60006060608073ffffffffffffffffffffffffffffffffffffffff16635fa55ca784866040518363ffffffff1660e01b8152600401611193929190611979565b600060405180830381865afa1580156111b0573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906111d99190611a19565b90506111e4816111ed565b91505092915050565b600060208201519050919050565b600060208201519050919050565b600061121483610e7e565b6112255761122260006107cc565b92505b61122e82610e7e565b61123f5761123c60006107cc565b91505b60008390506000839050600061127360028484608073ffffffffffffffffffffffffffffffffffffffff16622df619610e8b565b905080935050505092915050565b6060600061128e836112f5565b90506000602067ffffffffffffffff8111156112ad576112ac6116b8565b5b6040519080825280601f01601f1916602001820160405280156112df5781602001600182028036833780820191505090505b5090508181528360208201528092505050919050565b60008060ff8360001c169050601f81111561133c576040517fb3512b0c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80915050919050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061138482611359565b9050919050565b61139481611379565b811461139f57600080fd5b50565b6000813590506113b18161138b565b92915050565b600080fd5b6000602082840312156113d2576113d16113b7565b5b81905092915050565b6000806000606084860312156113f4576113f361134f565b5b6000611402868287016113a2565b9350506020611413868287016113a2565b925050604084013567ffffffffffffffff81111561143457611433611354565b5b611440868287016113bc565b9150509250925092565b6000819050919050565b61145d8161144a565b82525050565b60006020820190506114786000830184611454565b92915050565b60007fff0000000000000000000000000000000000000000000000000000000000000082169050919050565b6114b38161147e565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156114f35780820151818401526020810190506114d8565b60008484015250505050565b6000601f19601f8301169050919050565b600061151b826114b9565b61152581856114c4565b93506115358185602086016114d5565b61153e816114ff565b840191505092915050565b6000819050919050565b61155c81611549565b82525050565b61156b81611379565b82525050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6115a681611549565b82525050565b60006115b8838361159d565b60208301905092915050565b6000602082019050919050565b60006115dc82611571565b6115e6818561157c565b93506115f18361158d565b8060005b8381101561162257815161160988826115ac565b9750611614836115c4565b9250506001810190506115f5565b5085935050505092915050565b600060e082019050611644600083018a6114aa565b81810360208301526116568189611510565b9050818103604083015261166a8188611510565b90506116796060830187611553565b6116866080830186611562565b61169360a0830185611454565b81810360c08301526116a581846115d1565b905098975050505050505050565b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6116f0826114ff565b810181811067ffffffffffffffff8211171561170f5761170e6116b8565b5b80604052505050565b6000611722611345565b905061172e82826116e7565b919050565b600080fd5b600080fd5b600080fd5b600067ffffffffffffffff82111561175d5761175c6116b8565b5b611766826114ff565b9050602081019050919050565b82818337600083830152505050565b600061179561179084611742565b611718565b9050828152602081018484840111156117b1576117b061173d565b5b6117bc848285611773565b509392505050565b600082601f8301126117d9576117d8611738565b5b81356117e9848260208601611782565b91505092915050565b600060208284031215611808576118076116b3565b5b6118126020611718565b9050600082013567ffffffffffffffff81111561183257611831611733565b5b61183e848285016117c4565b60008301525092915050565b600061185636836117f2565b9050919050565b60008160601b9050919050565b60006118758261185d565b9050919050565b60006118878261186a565b9050919050565b61189f61189a82611379565b61187c565b82525050565b60006118b1828561188e565b6014820191506118c1828461188e565b6014820191508190509392505050565b60006060820190506118e66000830186611562565b6118f36020830185611562565b6119006040830184611454565b949350505050565b600060ff82169050919050565b61191e81611908565b82525050565b600081519050919050565b600082825260208201905092915050565b600061194b82611924565b611955818561192f565b93506119658185602086016114d5565b61196e816114ff565b840191505092915050565b600060408201905061198e6000830185611915565b81810360208301526119a08184611940565b90509392505050565b60006119bc6119b784611742565b611718565b9050828152602081018484840111156119d8576119d761173d565b5b6119e38482856114d5565b509392505050565b600082601f830112611a00576119ff611738565b5b8151611a108482602086016119a9565b91505092915050565b600060208284031215611a2f57611a2e61134f565b5b600082015167ffffffffffffffff811115611a4d57611a4c611354565b5b611a59848285016119eb565b91505092915050565b60006040820190508181036000830152611a7c8185611940565b9050611a8b6020830184611915565b9392505050565b6000606082019050611aa76000830186611915565b8181036020830152611ab98185611940565b90508181036040830152611acd8184611940565b9050949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611b1e57607f821691505b602082108103611b3157611b30611ad7565b5b5091905056fea2646970667358221220c045ce41d945612d8cf379ba40df2651af7e3a9e542f51490b202713f145347164736f6c63430008180033";

type FugaziPoolRegistryFacetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FugaziPoolRegistryFacetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FugaziPoolRegistryFacet__factory extends ContractFactory {
  constructor(...args: FugaziPoolRegistryFacetConstructorParams) {
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
      FugaziPoolRegistryFacet & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): FugaziPoolRegistryFacet__factory {
    return super.connect(runner) as FugaziPoolRegistryFacet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FugaziPoolRegistryFacetInterface {
    return new Interface(_abi) as FugaziPoolRegistryFacetInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): FugaziPoolRegistryFacet {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as FugaziPoolRegistryFacet;
  }
}
