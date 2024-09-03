/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export type InEuint32Struct = { data: BytesLike };

export type InEuint32StructOutput = [data: string] & { data: string };

export interface FugaziPoolRegistryFacetInterface extends Interface {
  getFunction(nameOrSignature: "createPool" | "eip712Domain"): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Deposit"
      | "EIP712DomainChanged"
      | "PoolCreated"
      | "Withdraw"
      | "facetAdded"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "createPool",
    values: [AddressLike, AddressLike, InEuint32Struct]
  ): string;
  encodeFunctionData(
    functionFragment: "eip712Domain",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "createPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "eip712Domain",
    data: BytesLike
  ): Result;
}

export namespace DepositEvent {
  export type InputTuple = [recipient: AddressLike, token: AddressLike];
  export type OutputTuple = [recipient: string, token: string];
  export interface OutputObject {
    recipient: string;
    token: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace EIP712DomainChangedEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PoolCreatedEvent {
  export type InputTuple = [
    tokenX: AddressLike,
    tokenY: AddressLike,
    poolId: BytesLike
  ];
  export type OutputTuple = [tokenX: string, tokenY: string, poolId: string];
  export interface OutputObject {
    tokenX: string;
    tokenY: string;
    poolId: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawEvent {
  export type InputTuple = [recipient: AddressLike, token: AddressLike];
  export type OutputTuple = [recipient: string, token: string];
  export interface OutputObject {
    recipient: string;
    token: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace facetAddedEvent {
  export type InputTuple = [selector: BytesLike, facet: AddressLike];
  export type OutputTuple = [selector: string, facet: string];
  export interface OutputObject {
    selector: string;
    facet: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface FugaziPoolRegistryFacet extends BaseContract {
  connect(runner?: ContractRunner | null): FugaziPoolRegistryFacet;
  waitForDeployment(): Promise<this>;

  interface: FugaziPoolRegistryFacetInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  createPool: TypedContractMethod<
    [
      tokenX: AddressLike,
      tokenY: AddressLike,
      _initialReserves: InEuint32Struct
    ],
    [string],
    "nonpayable"
  >;

  eip712Domain: TypedContractMethod<
    [],
    [
      [string, string, string, bigint, string, string, bigint[]] & {
        fields: string;
        name: string;
        version: string;
        chainId: bigint;
        verifyingContract: string;
        salt: string;
        extensions: bigint[];
      }
    ],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "createPool"
  ): TypedContractMethod<
    [
      tokenX: AddressLike,
      tokenY: AddressLike,
      _initialReserves: InEuint32Struct
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "eip712Domain"
  ): TypedContractMethod<
    [],
    [
      [string, string, string, bigint, string, string, bigint[]] & {
        fields: string;
        name: string;
        version: string;
        chainId: bigint;
        verifyingContract: string;
        salt: string;
        extensions: bigint[];
      }
    ],
    "view"
  >;

  getEvent(
    key: "Deposit"
  ): TypedContractEvent<
    DepositEvent.InputTuple,
    DepositEvent.OutputTuple,
    DepositEvent.OutputObject
  >;
  getEvent(
    key: "EIP712DomainChanged"
  ): TypedContractEvent<
    EIP712DomainChangedEvent.InputTuple,
    EIP712DomainChangedEvent.OutputTuple,
    EIP712DomainChangedEvent.OutputObject
  >;
  getEvent(
    key: "PoolCreated"
  ): TypedContractEvent<
    PoolCreatedEvent.InputTuple,
    PoolCreatedEvent.OutputTuple,
    PoolCreatedEvent.OutputObject
  >;
  getEvent(
    key: "Withdraw"
  ): TypedContractEvent<
    WithdrawEvent.InputTuple,
    WithdrawEvent.OutputTuple,
    WithdrawEvent.OutputObject
  >;
  getEvent(
    key: "facetAdded"
  ): TypedContractEvent<
    facetAddedEvent.InputTuple,
    facetAddedEvent.OutputTuple,
    facetAddedEvent.OutputObject
  >;

  filters: {
    "Deposit(address,address)": TypedContractEvent<
      DepositEvent.InputTuple,
      DepositEvent.OutputTuple,
      DepositEvent.OutputObject
    >;
    Deposit: TypedContractEvent<
      DepositEvent.InputTuple,
      DepositEvent.OutputTuple,
      DepositEvent.OutputObject
    >;

    "EIP712DomainChanged()": TypedContractEvent<
      EIP712DomainChangedEvent.InputTuple,
      EIP712DomainChangedEvent.OutputTuple,
      EIP712DomainChangedEvent.OutputObject
    >;
    EIP712DomainChanged: TypedContractEvent<
      EIP712DomainChangedEvent.InputTuple,
      EIP712DomainChangedEvent.OutputTuple,
      EIP712DomainChangedEvent.OutputObject
    >;

    "PoolCreated(address,address,bytes32)": TypedContractEvent<
      PoolCreatedEvent.InputTuple,
      PoolCreatedEvent.OutputTuple,
      PoolCreatedEvent.OutputObject
    >;
    PoolCreated: TypedContractEvent<
      PoolCreatedEvent.InputTuple,
      PoolCreatedEvent.OutputTuple,
      PoolCreatedEvent.OutputObject
    >;

    "Withdraw(address,address)": TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;
    Withdraw: TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;

    "facetAdded(bytes4,address)": TypedContractEvent<
      facetAddedEvent.InputTuple,
      facetAddedEvent.OutputTuple,
      facetAddedEvent.OutputObject
    >;
    facetAdded: TypedContractEvent<
      facetAddedEvent.InputTuple,
      facetAddedEvent.OutputTuple,
      facetAddedEvent.OutputObject
    >;
  };
}
