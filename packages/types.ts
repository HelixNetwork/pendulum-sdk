import * as Promise from "bluebird";
export type Maybe<T> = T | void;

export type Hash = string;
export type Tag = string;
export type HBytes = string;
export type TransactionHBytes = string;
export type AttachedTransactionHBytes = string;

export interface Balance {
  readonly balance: number;
}

/* Address object */
export interface Address extends Balance {
  readonly address: Hash;
  readonly keyIndex: number;
  readonly security: number;
}

export const makeAddress = (
  address: Hash,
  balance: number,
  keyIndex: number,
  security: number
): Address => ({
  address,
  keyIndex,
  security,
  balance
});

export interface Inputs {
  readonly inputs: ReadonlyArray<Address>;
  readonly totalBalance: number;
}

/* Transfer object */
export interface Transfer {
  readonly address: string;
  readonly value: number;
  readonly message?: string;
  readonly tag?: string;
  readonly obsoleteTag?: string;
}

/* Transaction object */
export interface Transaction {
  readonly hash: string;
  readonly signatureMessageFragment: string;
  readonly address: string;
  readonly value: number;
  readonly obsoleteTag: string;
  readonly timestamp: number;
  readonly currentIndex: number;
  readonly lastIndex: number;
  readonly bundle: string;
  readonly trunkTransaction: string;
  readonly branchTransaction: string;
  readonly tag: string;
  readonly attachmentTimestamp: number;
  readonly attachmentTimestampLowerBound: number;
  readonly attachmentTimestampUpperBound: number;
  readonly nonce: string;
  readonly confirmed?: boolean;
}

/* Bundle object */
export type Bundle = ReadonlyArray<Transaction>;

/* Neighbor object */
export interface Neighbor {
  readonly address: string;
  readonly numberOfAllTransactions: number;
  readonly numberOfInvalidTransactions: number;
  readonly numberOfNewTransactions: number;
}

/* List of Neighbors object, returned by `getNeighbors()` */
export type Neighbors = ReadonlyArray<Neighbor>;

/* List of helix Commands */
export enum ProtocolCommand {
  GET_NODE_INFO = "getNodeInfo",
  GET_NEIGHBORS = "getNeighbors",
  ADD_NEIGHBORS = "addNeighbors",
  REMOVE_NEIGHBORS = "removeNeighbors",
  GET_TIPS = "getTips",
  FIND_TRANSACTIONS = "findTransactions",
  GET_HBYTES = "getHBytes",
  GET_INCLUSION_STATES = "getInclusionStates",
  GET_BALANCES = "getBalances",
  GET_TRANSACTIONS_TO_APPROVE = "getTransactionsToApprove",
  ATTACH_TO_TANGLE = "attachToTangle",
  INTERRUPT_ATTACHING_TO_TANGLE = "interruptAttachingToTangle",
  BROADCAST_TRANSACTIONS = "broadcastTransactions",
  STORE_TRANSACTIONS = "storeTransactions",
  CHECK_CONSISTENCY = "checkConsistency",
  WERE_ADDRESSES_SPENT_FROM = "wereAddressesSpentFrom"
}

/* helix Command objects extend from this interface */
export interface BaseCommand {
  readonly command: string;
}

/** helix Command/Response interfaces */
export interface AddNeighborsCommand extends BaseCommand {
  command: ProtocolCommand.ADD_NEIGHBORS;
  readonly uris: ReadonlyArray<string>;
}

export interface AddNeighborsResponse {
  readonly addedNeighbors: number;
  readonly duration: number;
}
export interface AttachToTangleCommand extends BaseCommand {
  command: ProtocolCommand.ATTACH_TO_TANGLE;
  readonly trunkTransaction: Hash;
  readonly branchTransaction: Hash;
  readonly minWeightMagnitude: number;
  readonly hbytes: ReadonlyArray<TransactionHBytes>;
}

export interface AttachToTangleResponse {
  readonly hbytes: ReadonlyArray<TransactionHBytes>;
}

export interface BroadcastTransactionsCommand extends BaseCommand {
  command: ProtocolCommand.BROADCAST_TRANSACTIONS;
  readonly hbytes: ReadonlyArray<HBytes>;
}

export type BroadcastTransactionsResponse = void;

export interface CheckConsistencyCommand extends BaseCommand {
  command: ProtocolCommand.CHECK_CONSISTENCY;
  readonly tails: ReadonlyArray<Hash>;
}

export interface CheckConsistencyResponse {
  readonly state: boolean;
  readonly info: string;
}

export interface FindTransactionsQuery {
  readonly addresses?: ReadonlyArray<Hash>;
  readonly approvees?: ReadonlyArray<Hash>;
  readonly bundles?: ReadonlyArray<Hash>;
  readonly tags?: ReadonlyArray<Tag>;
}

export interface FindTransactionsCommand
  extends BaseCommand,
    FindTransactionsQuery {
  readonly command: ProtocolCommand.FIND_TRANSACTIONS;
}

export interface FindTransactionsResponse {
  readonly hashes: ReadonlyArray<Hash>;
}

export interface GetBalancesCommand extends BaseCommand {
  readonly command: string;
  readonly addresses: ReadonlyArray<Hash>;
  readonly threshold: number;
}

export interface GetBalancesResponse {
  readonly balances: ReadonlyArray<string>;
  readonly duration: number;
  readonly milestone: string;
  readonly milestoneIndex: number;
}

export interface Balances {
  readonly balances: ReadonlyArray<number>;
  readonly milestone: string;
  readonly milestoneIndex: number;
}

export interface GetInclusionStatesCommand extends BaseCommand {
  readonly command: ProtocolCommand.GET_INCLUSION_STATES;
  readonly transactions: ReadonlyArray<Hash>;
  readonly tips: ReadonlyArray<Hash>;
}

export interface GetInclusionStatesResponse {
  readonly states: ReadonlyArray<boolean>;
  readonly duration: number;
}

export interface GetNeighborsCommand extends BaseCommand {
  command: ProtocolCommand.GET_NEIGHBORS;
}

export interface GetNeighborsResponse {
  duration: number;
  neighbors: Neighbors;
}

export interface GetNodeInfoCommand extends BaseCommand {
  command: ProtocolCommand.GET_NODE_INFO;
}

export interface GetNodeInfoResponse {
  readonly appName: string;
  readonly appVersion: string;
  readonly duration: number;
  readonly jreAvailableProcessors: number;
  readonly jreFreeMemory: number;
  readonly jreMaxMemory: number;
  readonly jreTotalMemory: number;
  readonly latestMilestone: Hash;
  readonly latestMilestoneIndex: number;
  readonly latestSolidSubtangleMilestone: Hash;
  readonly latestSolidSubtangleMilestoneIndex: number;
  readonly neighbors: number;
  readonly packetsQueueSize: number;
  readonly time: number;
  readonly tips: number;
  readonly transactionsToRequest: number;
}

export interface GetTipsCommand extends BaseCommand {
  command: ProtocolCommand.GET_TIPS;
}

export interface GetTipsResponse {
  readonly hashes: ReadonlyArray<Hash>;
  readonly duration: number;
}

export interface TransactionsToApprove {
  readonly trunkTransaction: Hash;
  readonly branchTransaction: Hash;
}

export interface GetTransactionsToApproveResponse
  extends TransactionsToApprove {
  readonly duration: number;
}

export interface GetTransactionsToApproveCommand extends BaseCommand {
  command: ProtocolCommand.GET_TRANSACTIONS_TO_APPROVE;
  readonly depth: number;
  readonly reference?: Hash;
}

export interface GetHBytesCommand extends BaseCommand {
  command: ProtocolCommand.GET_HBYTES;
  readonly hashes: ReadonlyArray<Hash>;
}

export interface GetHBytesResponse {
  readonly hbytes: ReadonlyArray<HBytes>;
}

export interface InterruptAttachingToTangleCommand extends BaseCommand {
  command: ProtocolCommand.INTERRUPT_ATTACHING_TO_TANGLE;
}

export type InterruptAttachingToTangleResponse = void;

export interface RemoveNeighborsCommand extends BaseCommand {
  command: ProtocolCommand.REMOVE_NEIGHBORS;
  readonly uris: ReadonlyArray<string>;
}

export interface RemoveNeighborsResponse {
  readonly removedNeighbors: number;
  readonly duration: number;
}

export interface StoreTransactionsCommand extends BaseCommand {
  command: ProtocolCommand.STORE_TRANSACTIONS;
  readonly hbytes: ReadonlyArray<HBytes>;
}

export type StoreTransactionsResponse = void;

/** Callback */
export type Callback<R = any> = (
  err: Readonly<Error> | null,
  res?: Readonly<R>
) => void;

/** Provider interface */
export interface Provider {
  readonly send: <C extends BaseCommand, R>(
    command: Readonly<C>,
    callback?: Callback<Readonly<R>>
  ) => Promise<Readonly<R>>;
  readonly setSettings: <S>(settings?: Readonly<Partial<S>>) => void;
}

/** Attach to tangle */
export type AttachToTangle = (
  trunkTransaction: Hash,
  branchTransaction: Hash,
  minWeightMagnitude: number,
  hbytes: ReadonlyArray<HBytes>,
  callback?: Callback<ReadonlyArray<HBytes>>
) => Promise<ReadonlyArray<HBytes>>;

/* Util methods */
export const asArray = <T>(x: T | ReadonlyArray<T>): ReadonlyArray<T> =>
  Array.isArray(x) ? x : [x];

export const getOptionsWithDefaults = <T>(defaults: Readonly<T>) => (
  options: Readonly<Partial<T>>
): Readonly<T> => Object.assign({}, defaults, options); // tslint:disable-line prefer-object-spread
