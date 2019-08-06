## Modules

<dl>
<dt><a href="#module_bundle-validator">bundle-validator</a></dt>
<dd></dd>
<dt><a href="#module_bundle">bundle</a></dt>
<dd></dd>
<dt><a href="#module_checksum">checksum</a></dt>
<dd></dd>
<dt><a href="#module_converter">converter</a></dt>
<dd></dd>
<dt><a href="#module_core">core</a></dt>
<dd></dd>
<dt><a href="#module_extract-json">extract-json</a></dt>
<dd></dd>
<dt><a href="#module_http-client">http-client</a></dt>
<dd></dd>
<dt><a href="#module_multisig">multisig</a></dt>
<dd></dd>
<dt><a href="#module_signing">signing</a></dt>
<dd></dd>
<dt><a href="#module_transaction-converter">transaction-converter</a></dt>
<dd></dd>
<dt><a href="#module_transaction">transaction</a></dt>
<dd></dd>
<dt><a href="#module_unit-converter">unit-converter</a></dt>
<dd></dd>
<dt><a href="#module_validators">validators</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#API">API</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="module_bundle-validator"></a>

## bundle-validator

* [bundle-validator](#module_bundle-validator)

    * [~validateSignatures(bundle)](#module_bundle-validator..validateSignatures)

    * [~isBundle(bundle)](#module_bundle-validator..isBundle)


<a name="module_bundle-validator..validateSignatures"></a>

### *bundle-validator*~validateSignatures(bundle)

| Param | Type |
| --- | --- |
| bundle | <code>Array.&lt;Transaction&gt;</code> |

Validates all signatures of a bundle.

<a name="module_bundle-validator..isBundle"></a>

### *bundle-validator*~isBundle(bundle)

| Param | Type |
| --- | --- |
| bundle | <code>Array.&lt;Transaction&gt;</code> |

Checks if a bundle is _syntactically_ valid.
Validates signatures and overall structure.

<a name="module_bundle"></a>

## bundle

* [bundle](#module_bundle)

    * [~createBundle(entries)](#module_bundle..createBundle)

    * [~addEntry(transactions, entry)](#module_bundle..addEntry)

    * [~addTxHex(transactions, fragments, [offset])](#module_bundle..addTxHex)

    * [~finalizeBundle(transactions)](#module_bundle..finalizeBundle)


<a name="module_bundle..createBundle"></a>

### *bundle*~createBundle(entries)

| Param | Type | Description |
| --- | --- | --- |
| entries | <code>Array.&lt;BundleEntry&gt;</code> | Entries of signle or multiple transactions with the same address |

Creates a bunlde with given transaction entries.

**Returns**: <code>Array.&lt;Transaction&gt;</code> - List of transactions in the bundle  
<a name="module_bundle..addEntry"></a>

### *bundle*~addEntry(transactions, entry)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| transactions | <code>Array.&lt;Transaction&gt;</code> |  | List of transactions currently in the bundle |
| entry | <code>object</code> |  | Entry of single or multiple transactions with the same address |
| [entry.length] | <code>number</code> | <code>1</code> | Entry length, which indicates how many transactions in the bundle will occupy |
| [entry.address] | <code>string</code> |  | Address, defaults to all-0s |
| [entry.value] | <code>number</code> | <code>0</code> | Value to transfer in _HLX_ |
| [entry.signatureMessageFragments] | <code>Array.&lt;string&gt;</code> |  | Array of signature message fragment bytes, defaults to all-0s |
| [entry.timestamp] | <code>number</code> |  | Transaction timestamp, defaults to `Math.floor(Date.now() / 1000)` |
| [entry.tag] | <code>string</code> |  | Optional Tag, defaults to null tag (all-0s) |

Creates a bunlde with given transaction entries

**Returns**: <code>Array.&lt;Transaction&gt;</code> - Bundle  
<a name="module_bundle..addTxHex"></a>

### *bundle*~addTxHex(transactions, fragments, [offset])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| transactions | <code>Array.&lt;Transaction&gt;</code> |  | Transactions in the bundle |
| fragments | <code>Array.&lt;TxHex&gt;</code> |  | Message signature fragments to add |
| [offset] | <code>number</code> | <code>0</code> | Optional offset to start appending signature message fragments |


Adds a list of txs in the bundle starting at offset

**Returns**: <code>Array.&lt;Transaction&gt;</code> - Transactions of finalized bundle  
<a name="module_bundle..finalizeBundle"></a>

### *bundle*~finalizeBundle(transactions)

| Param | Type | Description |
| --- | --- | --- |
| transactions | <code>Array.&lt;Transaction&gt;</code> | Transactions in the bundle |

Finalizes the bundle by calculating the bundle hash

**Returns**: <code>Array.&lt;Transaction&gt;</code> - Transactions of finalized bundle  
<a name="module_checksum"></a>

## checksum
<a name="module_checksum..isValidChecksum"></a>

### *checksum*~isValidChecksum(addressWithChecksum)

| Param | Type |
| --- | --- |
| addressWithChecksum | <code>string</code> |

Validates the checksum of the given address txs.

<a name="module_converter"></a>

## converter

> Documentation on the new conversions are currently in works.

## core

* [core](#module_core)

    * [.composeApi([settings])](#module_core.composeApi)

    * [.createAddNeighbors(provider)](#module_core.createAddNeighbors)

    * [.addNeighbors(uris, [callback])](#module_core.addNeighbors)

    * [.createAttachToTangle(provider)](#module_core.createAttachToTangle)

    * [.attachToTangle(trunkTransaction, branchTransaction, minWeightMagnitude, txs, [callback])](#module_core.attachToTangle)

    * [.createBroadcastBundle(provider)](#module_core.createBroadcastBundle)

    * [.broadcastBundle(tailTransactionHash, [callback])](#module_core.broadcastBundle)

    * [.createBroadcastTransactions(provider)](#module_core.createBroadcastTransactions)

    * [.broadcastTransactions(txs, [callback])](#module_core.broadcastTransactions)

    * [.createCheckConsistency(provider)](#module_core.createCheckConsistency)

    * [.checkConsistency(transactions, [options], [callback])](#module_core.checkConsistency)

    * [.createFindTransactionObjects(provider)](#module_core.createFindTransactionObjects)

    * [.findTransactionObjects(query, [callback])](#module_core.findTransactionObjects)

    * [.createFindTransactions(provider)](#module_core.createFindTransactions)

    * [.findTransactions(query, [callback])](#module_core.findTransactions)

    * [.createGetAccountData(provider)](#module_core.createGetAccountData)

    * [.getAccountData(seed, options, [callback])](#module_core.getAccountData)

    * [.createGetBalances(provider)](#module_core.createGetBalances)

    * [.getBalances(addresses, threshold, [callback])](#module_core.getBalances)

    * [.createGetBundle(provider)](#module_core.createGetBundle)

    * [.getBundle(tailTransactionHash, [callback])](#module_core.getBundle)

    * [.createGetInclusionStates(provider)](#module_core.createGetInclusionStates)

    * [.getInclusionStates(transactions, tips, [callback])](#module_core.getInclusionStates)

    * [.createGetInputs(provider)](#module_core.createGetInputs)

    * [.getInputs(seed, [options], [callback])](#module_core.getInputs)

    * [.createGetLatestInclusion(provider)](#module_core.createGetLatestInclusion)

    * [.getLatestInclusion(transactions, tips, [callback])](#module_core.getLatestInclusion)

    * [.createGetNeighbors(provider)](#module_core.createGetNeighbors)

    * [.getNeighbors([callback])](#module_core.getNeighbors)

    * [.createGetNewAddress(provider)](#module_core.createGetNewAddress)

    * [.getNewAddress(seed, [options], [callback])](#module_core.getNewAddress)

    * [.createGetNodeInfo(provider)](#module_core.createGetNodeInfo)

    * [.getNodeInfo([callback])](#module_core.getNodeInfo)

    * [.createGetTips(provider)](#module_core.createGetTips)

    * [.getTips([callback])](#module_core.getTips)

    * [.createGetTransactionObjects(provider)](#module_core.createGetTransactionObjects)

    * [.getTransactionObjects(hashes, [callback])](#module_core.getTransactionObjects)

    * [.createGetTransactionsToApprove(provider)](#module_core.createGetTransactionsToApprove)

    * [.getTransactionsToApprove(depth, [reference], [callback])](#module_core.getTransactionsToApprove)

    * [.createGetTransactionStrings(provider)](#module_core.createGetTransactionStrings)

    * [.getTransactionStrings(hashes, [callback])](#module_core.getTransactionStrings)

    * [.createIsPromotable(provider, [depth])](#module_core.createIsPromotable)

    * [.isPromotable(tail, [callback])](#module_core.isPromotable)

    * [.createPrepareTransfers([provider])](#module_core.createPrepareTransfers)

    * [.prepareTransfers(seed, transfers, [options], [callback])](#module_core.prepareTransfers)

    * [.createPromoteTransaction(provider, [attachFn])](#module_core.createPromoteTransaction)

    * [.promoteTransaction(tail, depth, minWeightMagnitude, transfer, [options], [callback])](#module_core.promoteTransaction)

    * [.createRemoveNeighbors(provider)](#module_core.createRemoveNeighbors)

    * [.removeNeighbors(uris, [callback])](#module_core.removeNeighbors)

    * [.createReplayBundle(provider)](#module_core.createReplayBundle)

    * [.replayBundle(tail, depth, minWeightMagnitude, [callback])](#module_core.replayBundle)

    * [.createSendTransactionStrings(provider)](#module_core.createSendTransactionStrings)

    * [.sendTransactionStrings(txs, depth, minWeightMagnitude, [reference], [callback])](#module_core.sendTransactionStrings)

    * [.createStoreAndBroadcast(provider)](#module_core.createStoreAndBroadcast)

    * [.storeAndBroadcast(txs, [callback])](#module_core.storeAndBroadcast)

    * [.createStoreTransactions(provider)](#module_core.createStoreTransactions)

    * [.storeTransactions(txs, [callback])](#module_core.storeTransactions)

    * [.createTraverseBundle(provider)](#module_core.createTraverseBundle)

    * [.traverseBundle(trunkTransaction, [bundle], [callback])](#module_core.traverseBundle)

    * [.generateAddress(seed, index, [security], [checksum])](#module_core.generateAddress)


<a name="module_core.composeApi"></a>

### *core*.composeApi([settings])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>object</code> \| <code>function</code> | <code>{} | provider</code> | Connection settings or `provider` factory |
| [settings.provider] | <code>string</code> | <code>&quot;http://localhost:14700&quot;</code> | Uri of the node |
| [settings.attachToTangle] | <code>function</code> |  | Function to override [`attachToTangle`](#module_core.attachToTangle) with |
| [settings.apiVersion] | <code>string</code> \| <code>number</code> | <code>1</code> | Helix Api version to be sent as `X-HELIX-API-Version` header. |
| [settings.requestBatchSize] | <code>number</code> | <code>1000</code> | Number of search values per request. |

Composes API object from it's components

<a name="module_core.createAddNeighbors"></a>

### *core*.createAddNeighbors(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`addNeighbors`](#module_core.addNeighbors)  
<a name="module_core.addNeighbors"></a>

### *core*.addNeighbors(uris, [callback])
**Fulfil**: <code>number</code> Number of neighbors that were added  
**Reject**: <code>Error</code>
- `INVALID_URI`: Invalid uri
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| uris | <code>Array</code> | List of URI's |
| [callback] | <code>Callback</code> | Optional callback |

Adds a list of neighbors to the connected node by calling
[`addNeighbors`](https://docs.helix.net/hlx/api#endpoints/addNeighbors) command.
Assumes `addNeighbors` command is available on the node.

`addNeighbors` has temporary effect until your node relaunches.

**Example**  
```js
addNeighbors(['udp://148.148.148.148:14265'])
  .then(numAdded => {
    // ...
  }).catch(err => {
    // ...
  })
```
<a name="module_core.createAttachToTangle"></a>

### *core*.createAttachToTangle(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`attachToTangle`](#module_core.attachToTangle)  
<a name="module_core.attachToTangle"></a>

### *core*.attachToTangle(trunkTransaction, branchTransaction, minWeightMagnitude, txs, [callback])
**Fulfill**: <code>TransactionTxHex[]</code> Array of transaction txs with nonce and attachment timestamps  
**Reject**: <code>Error</code>
- `INVALID_TRUNK_TRANSACTION`: Invalid `trunkTransaction`
- `INVALID_BRANCH_TRANSACTION`: Invalid `branchTransaction`
- `INVALID_MIN_WEIGHT_MAGNITUDE`: Invalid `minWeightMagnitude` argument
- `INVALID_TRANSACTION_TRYTES`: Invalid transaction txs
- `INVALID_TRANSACTIONS_TO_APPROVE`: Invalid transactions to approve
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| trunkTransaction | <code>Hash</code> | Trunk transaction as returned by [`getTransactionsToApprove`](#module_core.getTransactionsToApprove) |
| branchTransaction | <code>Hash</code> | Branch transaction as returned by [`getTransactionsToApprove`](#module_core.getTransactionsToApprove) |
| minWeightMagnitude | <code>number</code> | Number of minimun trailing zeros in tail transaction hash |
| txs | <code>Array.&lt;TransactionTxHex&gt;</code> | List of transaction txs |
| [callback] | <code>Callback</code> | Optional callback |

Performs the Proof-of-Work required to attach a transaction to the Tangle by
calling [`attachToTangle`](https://docs.helix.net/hlx/api#endpoints/attachToTangle) command.
Returns list of transaction txs and overwrites the following fields:
 - `hash`
 - `nonce`
 - `attachmentTimestamp`
 - `attachmentTimsetampLowerBound`
 - `attachmentTimestampUpperBound`

This method can be replaced with a local equivelant such as
[`pow.interface.js`](https://github.com/helixnetwork/pow.interface.js) in node.js,
[`pow.lib`](https://github.com/helixnetwork/pow.lib) which works on WebGL 2 enabled browsers
or remote [`PoW-Integrator`](https://pow.helix.net/).

`trunkTransaction` and `branchTransaction` hashes are given by
[`getTransactionToApprove`](#module_core.getTransactionsToApprove).

**Example**  
```js
getTransactionsToApprove(depth)
  .then(({ trunkTransaction, branchTransaction }) =>
    attachToTangle(trunkTransaction, branchTransaction, minWightMagnitude, txs)
  )
  .then(attachedTxHex => {
    // ...
  })
  .catch(err => {
    // ...
  })
```
<a name="module_core.createBroadcastBundle"></a>

### *core*.createBroadcastBundle(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`broadcastBundle`](#module_core.broadcastBundle)  
<a name="module_core.broadcastBundle"></a>

### *core*.broadcastBundle(tailTransactionHash, [callback])
**Fulfil**: <code>Transaction[]</code> List of transaction objects  
**Reject**: <code>Error</code>
- `INVALID_HASH`: Invalid tail transaction hash
- `INVALID_BUNDLE`: Invalid bundle
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| tailTransactionHash | <code>Hash</code> | Tail transaction hash |
| [callback] | <code>Callback</code> | Optional callback |

Re-broadcasts all transactions in a bundle given the tail transaction hash.
It might be useful when transactions did not properly propagate,
particularly in the case of large bundles.

**Example**  
```js
broadcastTransactions(tailHash)
  .then(transactions => {
     // ...
  })
  .catch(err => {
    // ...
  })
```
<a name="module_core.createBroadcastTransactions"></a>

### *core*.createBroadcastTransactions(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`broadcastTransactions`](#module_core.broadcastTransactions)  
<a name="module_core.broadcastTransactions"></a>


### *core*.broadcastTransactions(txs, [callback])
**Fulfill**: <code>TxHex[]</code> Attached transactions (txs)  
**Reject**: <code>Error</code>
- `INVALID_ATTACHED_TRYTES`: Invalid array of attached txs
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |

| txs | <code>Array.&lt;TransactionTxHex&gt;</code> | Attached txs |
| [callback] | <code>Callback</code> | Optional callback |

Broadcasts an list of _attached_ transaction txs to the network by calling

[`boradcastTransactions`](https://docs.helix.net/hlx/api#endpoints/broadcastTransactions) command.
Tip selection and Proof-of-Work must be done first, by calling
[`getTransactionsToApprove`](#module_core.getTransactionsToApprove) and
[`attachToTangle`](#module_core.attachToTangle) or an equivalent attach method or remote
[`PoWbox`](https://powbox.testnet.iota.org/), which is a development tool.

You may use this method to increase odds of effective transaction propagation.


Persist the transaction txs in local storage **before** calling this command for first time, to ensure

that reattachment is possible, until your bundle has been included.

**Example**  
```js
broadcastTransactions(txs)
  .then(txs => {
     // ...
  })
  .catch(err => {
    // ...
  })
```
<a name="module_core.createCheckConsistency"></a>

### *core*.createCheckConsistency(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`checkConsistency`](#module_core.checkConsistency)  
<a name="module_core.checkConsistency"></a>

### *core*.checkConsistency(transactions, [options], [callback])
**Fulfil**: <code>boolean</code> Consistency state of given transaction or co-consistency of given transactions.  
**Reject**: <code>Error</code>
- `INVALID_TRANSACTION_HASH`: Invalid transaction hash
- Fetch error
- Reason for returning `false`, if called with `options.rejectWithReason`  

| Param | Type | Description |
| --- | --- | --- |
| transactions | <code>Hash</code> \| <code>Array.&lt;Hash&gt;</code> | Tail transaction hash (hash of transaction with `currentIndex=0`), or array of tail transaction hashes. |
| [options] | <code>object</code> | Options |
| [options.rejectWithReason] | <code>boolean</code> | Enables rejection if state is `false`, with reason as error message |
| [callback] | <code>Callback</code> | Optional callback. |

Checks if a transaction is _consistent_ or a set of transactions are _co-consistent_, by calling
[`checkConsistency`](https://docs.helix.net/hlx/api#endpoints/checkConsistency) command.
_Co-consistent_ transactions and the transactions that they approve (directly or inderectly),
are not conflicting with each other and rest of the ledger.

As long as a transaction is consistent it might be accepted by the network.
In case transaction is inconsistent, it will not be accepted, and a reattachment
is required by calling [`replaybundle`](#module_core.replayBundle).

**Example**  
```js
checkConsistency(tailHash)
  .then(isConsistent => {
    // ...
  })
  .catch(err => {
    // ...
  })
```
**Example**  
##### Example with `checkConsistency` & `isPromotable`

Consistent transactions might remain pending due to networking issues,
or if not referenced by recent milestones issued by
[Coordinator](https://docs.iota.org/introduction/tangle/consensus).
Therefore `checkConsistency` with a time heuristic can determine
if a transaction should be [_promoted_](promoteTransaction)
or [_reattached_](replayBundle).
This functionality is abstracted in [`isPromotable`](isPromotable).

```js
const isAboveMaxDepth = attachmentTimestamp => (
   // Check against future timestamps
   attachmentTimestamp < Date.now() &&
   // Check if transaction wasn't issued before last 6 milestones
   // Milestones are being issued every ~2mins
   Date.now() - attachmentTimestamp < 11 * 60 * 1000
)

const isPromotable = ({ hash, attachmentTimestamp }) => (
  checkConsistency(hash)
     .then(isConsistent => (
       isConsistent &&
       isAboveMaxDepth(attachmentTimestamp)
     ))
)
```
<a name="module_core.createFindTransactionObjects"></a>

### *core*.createFindTransactionObjects(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider for accessing a helix node |

**Returns**: <code>function</code> - [`findTransactionObjects`](#module_core.findTransactionObjects)  
<a name="module_core.findTransactionObjects"></a>

### *core*.findTransactionObjects(query, [callback])
**Fulfil**: <code>Transaction[]</code> Array of transaction objects  
**Reject**: <code>Error</code>
- `INVALID_SEARCH_KEY`
- `INVALID_HASH`: Invalid bundle hash
- `INVALID_TRANSACTION_HASH`: Invalid approovee transaction hash
- `INVALID_ADDRESS`: Invalid address
- `INVALID_TAG`: Invalid tag
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>object</code> |  |
| [query.addresses] | <code>Array.&lt;Hash&gt;</code> | List of addresses |
| [query.bundles] | <code>Array.&lt;Hash&gt;</code> | List of bundle hashes |
| [query.tags] | <code>Array.&lt;Tag&gt;</code> | List of tags |
| [query.addresses] | <code>Array.&lt;Hash&gt;</code> | List of approvees |
| [callback] | <code>Callback</code> | Optional callback |

Wrapper function for [`findTransactions`](#module_core.findTransactions) and
[`getTransactionStrings`](#module_core.getTransactionStrings).
Searches for transactions given a `query` object with `addresses`, `tags` and `approvees` fields.
Multiple query fields are supported and `findTransactionObjects` returns intersection of results.

**Example**  
Searching for transactions by address:

```js
findTransactionObjects({ addresses: ['ADR...'] })
   .then(transactions => {
       // ...
   })
   .catch(err => {
       // ...
   })
```
<a name="module_core.createFindTransactions"></a>

### *core*.createFindTransactions(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider for accessing a helix node |

**Returns**: <code>function</code> - [`findTransactionObjects`](#module_core.findTransactions)  
<a name="module_core.findTransactions"></a>

### *core*.findTransactions(query, [callback])
**Fulfil**: <code>Hash[]</code> Array of transaction hashes  
**Reject**: <code>Error</code>
- `INVALID_SEARCH_KEY`
- `INVALID_HASH`: Invalid bundle hash
- `INVALID_TRANSACTION_HASH`: Invalid approvee transaction hash
- `INVALID_ADDRESS`: Invalid address
- `INVALID_TAG`: Invalid tag
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>object</code> |  |
| [query.addresses] | <code>Array.&lt;Hash&gt;</code> | List of addresses |
| [query.bundles] | <code>Array.&lt;Hash&gt;</code> | List of bundle hashes |
| [query.tags] | <code>Array.&lt;Tag&gt;</code> | List of tags |
| [query.addresses] | <code>Array.&lt;Hash&gt;</code> | List of approvees |
| [callback] | <code>Callback</code> | Optional callback |

Searches for transaction `hashes`  by calling
[`findTransactions`](https://docs.helix.net/hlx/api#endpoints/findTransactions) command.
It allows to search for transactions by passing a `query` object with `addresses`, `tags` and `approvees` fields.
Multiple query fields are supported and `findTransactions` returns intersection of results.

**Example**  
```js
findTransactions({ addresses: ['ADRR...'] })
   .then(hashes => {
       // ...
   })
   .catch(err => {
       // handle errors here
   })
```
<a name="module_core.createGetAccountData"></a>

### *core*.createGetAccountData(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider for accessing a helix node |

**Returns**: <code>function</code> - [`getAccountData`](#module_core.getAccountData)  
<a name="module_core.getAccountData"></a>

### *core*.getAccountData(seed, options, [callback])
**Fulfil**: <code>AccountData</code>  
**Reject**: <code>Error</code>
- `INVALID_SEED`
- `INVALID_START_OPTION`
- `INVALID_START_END_OPTIONS`: Invalid combination of start & end options`
- Fetch error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| seed | <code>string</code> |  |  |
| options | <code>object</code> |  |  |
| [options.start] | <code>number</code> | <code>0</code> | Starting key index |
| [options.security] | <code>number</code> | <code>0</code> | Security level to be used for getting inputs and addresses |
| [options.end] | <code>number</code> |  | Ending key index |
| [callback] | <code>Callback</code> |  | Optional callback |

Returns an `AccountData` object, containing account information about `addresses`, `transactions`,
`inputs` and total account balance.

**Example**  
```js
getAccountData(seed, {
   start: 0,
   security: 2
})
  .then(accountData => {
    const { addresses, inputs, transactions, balance } = accountData
    // ...
  })
  .catch(err => {
    // ...
  })
```
<a name="module_core.createGetBalances"></a>

### *core*.createGetBalances(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`getBalances`](#module_core.getBalances)  
<a name="module_core.getBalances"></a>

### *core*.getBalances(addresses, threshold, [callback])
**Fulfil**: <code>Balances</code> Object with list of `balances` and corresponding `milestone`  
**Reject**: <code>Error</code>
- `INVALID_HASH`: Invalid address
- `INVALID_THRESHOLD`: Invalid `threshold`
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| addresses | <code>Array.&lt;Hash&gt;</code> | List of addresses |
| threshold | <code>number</code> | Confirmation threshold, currently `100` should be used |
| [callback] | <code>Callback</code> | Optional callback |

Fetches _confirmed_ balances of given addresses at the latest solid milestone,
by calling [`getBalances`](https://docs.helix.net/hlx/api#endpoints/getBalances) command.

**Example**  
```js
getBalances([address], 100)
  .then(({ balances }) => {
    // ...
  })
  .catch(err => {
    // ...
  })
```
<a name="module_core.createGetBundle"></a>

### *core*.createGetBundle(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider for accessing a helix node |

**Returns**: <code>function</code> - [`getBundle`](#module_core.getBundle)  
<a name="module_core.getBundle"></a>

### *core*.getBundle(tailTransactionHash, [callback])
**Fulfil**: <code>Transaction[]</code> Bundle as array of transaction objects  
**Reject**: <code>Error</code>
- `INVALID_TRANSACTION_HASH`
- `INVALID_TAIL_HASH`: Provided transaction is not tail (`currentIndex !== 0`)
- `INVALID_BUNDLE`: Bundle is syntactically invalid
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| tailTransactionHash | <code>Hash</code> | Tail transaction hash |
| [callback] | <code>Callback</code> | Optional callback |

Fetches and validates the bundle given a _tail_ transaction hash, by calling
[`traverseBundle`](#module_core.traverseBundle) and traversing through `trunkTransaction`.

**Example**  
```js
getBundle(tail)
   .then(bundle => {
       // ...
   })
   .catch(err => {
       // handle errors
   })
```
<a name="module_core.createGetInclusionStates"></a>

### *core*.createGetInclusionStates(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider for accessing a helix node |

**Returns**: <code>function</code> - [`getInclusionStates`](#module_core.getInclusionStates)  
<a name="module_core.getInclusionStates"></a>

### *core*.getInclusionStates(transactions, tips, [callback])
**Fulfil**: <code>boolean[]</code> Array of inclusion state  
**Reject**: <code>Error</code>
- `INVALID_TRANSACTION_HASH`: Invalid `hashes` or `tips`
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| transactions | <code>Array.&lt;Hash&gt;</code> | List of transaction hashes |
| tips | <code>Array.&lt;Hash&gt;</code> | List of tips to check if transactions are referenced by |
| [callback] | <code>Callback</code> | Optional callback |

Fetches inclusion states of given list of transactions, by calling
[`getInclusionStates`](https://docs.helix.net/hlx/api#endpoints/getInclusionsStates) command.

**Example**  
```js
getInclusionStates(transactions)
  .then(states => {
    // ...
  })
  .catch(err => {
    // ...
  })
```
<a name="module_core.createGetInputs"></a>

### *core*.createGetInputs(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider for accessing a helix node |

**Returns**: <code>function</code> - [`getInputs`](#module_core.getInputs)  
<a name="module_core.getInputs"></a>

### *core*.getInputs(seed, [options], [callback])
**Fulfil**: <code>Inputs</code> Inputs object containg a list of `[Address](Address)` objects and `totalBalance` field  
**Reject**: <code>Error</code>
- `INVALID_SEED`
- `INVALID_SECURITY_LEVEL`
- `INVALID_START_OPTION`
- `INVALID_START_END_OPTIONS`
- `INVALID_THRESHOLD`
- `INSUFFICIENT_BALANCE`
- Fetch error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| seed | <code>string</code> |  |  |
| [options] | <code>object</code> |  |  |
| [options.start] | <code>number</code> | <code>0</code> | Index offset indicating from which address we start scanning for balance |
| [options.end] | <code>number</code> |  | Last index up to which we stop scanning |
| [options.security] | <code>number</code> | <code>2</code> | Security level of inputs |
| [options.threshold] | <code>threshold</code> |  | Minimum amount of balance required |
| [callback] | <code>Callback</code> |  | Optional callback |

Creates and returns an `Inputs` object by generating addresses and fetching their latest balance.

**Example**  
```js
getInputs(seed, { start: 0, threhold })
  .then(({ inputs, totalBalance }) => {
    // ...
  })
  .catch(err => {
    if (err.message === errors.INSUFFICIENT_BALANCE) {
       // ...
    }
    // ...
  })
```
<a name="module_core.createGetLatestInclusion"></a>

### *core*.createGetLatestInclusion(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider for accessing a helix node |

**Returns**: <code>function</code> - [`getLatestInclusion`](#module_core.getLatestInclusion)  
<a name="module_core.getLatestInclusion"></a>

### *core*.getLatestInclusion(transactions, tips, [callback])
**Fulfil**: <code>boolean[]</code> List of inclusion states  
**Reject**: <code>Error</code>
- `INVALID_HASH`: Invalid transaction hash
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| transactions | <code>Array.&lt;Hash&gt;</code> | List of transactions hashes |
| tips | <code>number</code> | List of tips to check if transactions are referenced by |
| [callback] | <code>Callback</code> | Optional callback |

Fetches inclusion states of given transactions and a list of tips,
by calling [`getInclusionStates`](#module_core.getInclusionStates) on `latestSolidSubtangleMilestone`.

**Example**  
```js
getLatestInclusion(hashes)
   .then(states => {
       // ...
   })
   .catch(err => {
       // handle error
   })
```
<a name="module_core.createGetNeighbors"></a>

### *core*.createGetNeighbors(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`getNeighbors`](#module_core.getNeighbors)  
<a name="module_core.getNeighbors"></a>

### *core*.getNeighbors([callback])
**Fulfil**: <code>Neighbors</code>  
**Reject**: <code>Error</code>
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>Callback</code> | Optional callback |

Returns list of connected neighbors.

<a name="module_core.createGetNewAddress"></a>

### *core*.createGetNewAddress(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`getNewAddress`](#module_core.getNewAddress)  
<a name="module_core.getNewAddress"></a>

### *core*.getNewAddress(seed, [options], [callback])
**Fulfil**: <code>Hash\|Hash[]</code> New (unused) address or list of addresses up to (and including) first unused address  
**Reject**: <code>Error</code>
- `INVALID_SEED`
- `INVALID_START_OPTION`
- `INVALID_SECURITY`
- Fetch error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| seed | <code>string</code> |  | At least 32 txs long seed |
| [options] | <code>object</code> |  |  |
| [options.index] | <code>number</code> | <code>0</code> | Key index to start search at |
| [options.security] | <code>number</code> | <code>2</code> | Security level |
| [options.checksum] | <code>boolean</code> | <code>false</code> | `Deprecated` Flag to include 0-txs checksum or not |
| [options.total] | <code>number</code> |  | `Deprecated` Number of addresses to generate. |
| [options.returnAll] | <code>boolean</code> | <code>false</code> | `Deprecated` Flag to return all addresses, from start up to new address. |
| [callback] | <code>Callback</code> |  | Optional callback |

Generates and returns a new address by calling [`findTransactions`](#module_core.findTransactions)
until the first unused address is detected. This stops working after a snapshot.

**Example**  
```js
getNewAddress(seed, { index })
  .then(address => {
    // ...
  })
  .catch(err => {
    // ...
  })
```
<a name="module_core.createGetNodeInfo"></a>

### *core*.createGetNodeInfo(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`getNodeInfo`](#module_core.getNodeInfo)  
<a name="module_core.getNodeInfo"></a>

### *core*.getNodeInfo([callback])
**Fulfil**: <code>NodeInfo</code> Object with information about connected node.  
**Reject**: <code>Error</code>
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>Callback</code> | Optional callback |

Returns information about connected node by calling
[`getNodeInfo`](https://docs.helix.net/hlx/api#endpoints/getNodeInfo) command.

**Example**  
```js
getNodeInfo()
  .then(info => console.log(info))
  .catch(err => {
    // ...
  })
```
<a name="module_core.createGetTips"></a>

### *core*.createGetTips(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`getTips`](#module_core.getTips)  
<a name="module_core.getTips"></a>

### *core*.getTips([callback])
**Fulfil**: <code>Hash[]</code> List of tip hashes  
**Reject**: <code>Error</code>
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>Callback</code> | Optional callback |

Returns a list of tips (transactions not referenced by other transactions),
as seen by the connected node.

**Example**  
```js
getTips()
  .then(tips => {
    // ...
  })
  .catch(err => {
    // ...
  })
```
<a name="module_core.createGetTransactionObjects"></a>

### *core*.createGetTransactionObjects(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`getTransactionObjects`](#module_core.getTransactionObjects)  
<a name="module_core.getTransactionObjects"></a>

### *core*.getTransactionObjects(hashes, [callback])
**Fulfil**: <code>Transaction[]</code> - List of transaction objects  
**Reject**: <code>Error</code>
- `INVALID_TRANSACTION_HASH`
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| hashes | <code>Array.&lt;Hash&gt;</code> | Array of transaction hashes |
| [callback] | <code>function</code> | Optional callback |

Fetches the transaction objects, given an array of transaction hashes.

**Example**  
```js
getTransactionObjects(hashes)
  .then(transactions => {
    // ...
  })
  .catch(err => {
    // handle errors
  })
```
<a name="module_core.createGetTransactionsToApprove"></a>

### *core*.createGetTransactionsToApprove(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`getTransactionsToApprove`](#module_core.getTransactionsToApprove)  
<a name="module_core.getTransactionsToApprove"></a>

### *core*.getTransactionsToApprove(depth, [reference], [callback])
**Fulfil**: <code>trunkTransaction, branchTransaction</code> A pair of approved transactions  
**Reject**: <code>Error</code>
- `INVALID_DEPTH`
- `INVALID_REFERENCE_HASH`: Invalid reference hash
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| depth | <code>number</code> | The depth at which Random Walk starts. A value of `3` is typically used by wallets, meaning that RW starts 3 milestones back. |
| [reference] | <code>Hash</code> | Optional reference transaction hash |
| [callback] | <code>Callback</code> | Optional callback |

Does the _tip selection_ by calling
[`getTransactionsToApprove`](https://docs.helix.net/hlx/api#endpoints/getTransactionsToApprove) command.
Returns a pair of approved transactions, which are chosen randomly after validating the transaction txs,
the signatures and cross-checking for conflicting transactions.

Tip selection is executed by a Random Walk (RW) starting at random point in given `depth`
ending up to the pair of selected tips. For more information about tip selection please refer to the
[whitepaper](https://hlx.ai/helix-protocol.pdf).

The `reference` option allows to select tips in a way that the reference transaction is being approved too.
This is useful for promoting transactions, for example with
[`promoteTransaction`](#module_core.promoteTransaction).

**Example**  
```js
const depth = 3
const minWeightMagnitude = 2

getTransactionsToApprove(depth)
  .then(transactionsToApprove =>
     attachToTangle(minWightMagnitude, txs, { transactionsToApprove })
  )
  .then(storeAndBroadcast)
  .catch(err => {
    // handle errors here
  })
```
<a name="module_core.createGetTransactionStrings"></a>

### *core*.createGetTransactionStrings(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |


**Returns**: <code>function</code> - [`getTransactionStrings`](#module_core.getTransactionStrings)  
<a name="module_core.getTransactionStrings"></a>

### *core*.getTransactionStrings(hashes, [callback])
**Fulfil**: <code>String[]</code> - Transaction strings (txs)

**Reject**: Error{}
- `INVALID_TRANSACTION_HASH`: Invalid hash
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| hashes | <code>Array.&lt;Hash&gt;</code> | List of transaction hashes |
| [callback] | <code>Callback</code> | Optional callback |

Fetches the transaction strings given a list of transaction hashes, by calling
[`getTransactionStrings`](https://docs.helix.net/hlx/api#endpoints/getTransactionStrings) command.

**Example**  
```js
getTransactionStrings(hashes)
  // Parsing as transaction objects
  .then(txs => asTransactionObjects(hashes)(txs))
  .then(transactions => {
    // ...
  })
  .catch(err => {
    // ...
  })
```
<a name="module_core.createIsPromotable"></a>

### *core*.createIsPromotable(provider, [depth])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| provider | <code>Provider</code> |  | Network provider |
| [depth] | <code>number</code> | <code>6</code> | Depth up to which promotion is effective. |

**Returns**: <code>function</code> - [`isPromotable`](#module_core.isPromotable)  
<a name="module_core.isPromotable"></a>

### *core*.isPromotable(tail, [callback])
**Fulfil**: <code>boolean</code> Consistency state of transaction or co-consistency of transactions  
**Reject**: <code>Error</code>
- `INVALID_HASH`: Invalid hash
- `INVALID_DEPTH`: Invalid depth
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| tail | <code>Hash</code> | Tail transaction hash |
| [callback] | <code>Callback</code> | Optional callback |

Checks if a transaction is _promotable_, by calling [`checkConsistency`](#module_core.checkConsistency) and
verifying that `attachmentTimestamp` is above a lower bound.
Lower bound is calculated based on number of milestones issued
since transaction attachment.

**Example**  
#### Example with promotion and reattachments

Using `isPromotable` to determine if transaction can be [_promoted_](#module_core.promoteTransaction)
or should be [_reattached_](#module_core.replayBundle)

```js
// We need to monitor inclusion states of all tail transactions (original tail & reattachments)
const tails = [tail]

getLatestInclusion(tails)
  .then(states => {
    // Check if none of transactions confirmed
    if (states.indexOf(true) === -1) {
      const tail = tails[tails.length - 1] // Get latest tail hash

      return isPromotable(tail)
        .then(isPromotable => isPromotable
          ? promoteTransaction(tail, 3, 14)
          : replayBundle(tail, 3, 14)
            .then(([reattachedTail]) => {
              const newTailHash = reattachedTail.hash

              // Keeping track of all tail hashes to check confirmation
              tails.push(newTailHash)

              // Promote the new tail...
            })
    }
  }).catch(err => {
    // ...
  })
```
<a name="module_core.createPrepareTransfers"></a>

### *core*.createPrepareTransfers([provider])

| Param | Type | Description |
| --- | --- | --- |
| [provider] | <code>Provider</code> | Optional network provider to fetch inputs and remainder address. In case this is omitted, proper input objects and remainder should be passed to [`prepareTransfers`](#module_core.prepareTransfers), if required. |

Create a [`prepareTransfers`](#module_core.prepareTransfers) function by passing an optional newtowrk `provider`.
It is possible to prepare and sign transactions offline, by omitting the provider option.

**Returns**: <code>function</code> - [`prepareTransfers`](#module_core.prepareTransfers)  
<a name="module_core.prepareTransfers"></a>

### *core*.prepareTransfers(seed, transfers, [options], [callback])

**Fulfil**: <code>array</code> txs Returns bundle txs  
**Reject**: <code>Error</code>
- `INVALID_SEED`
- `INVALID_TRANSFER_ARRAY`
- `INVALID_INPUT`
- `INVALID_REMAINDER_ADDRESS`
- `INSUFFICIENT_BALANCE`
- `NO_INPUTS`
- `SENDING_BACK_TO_INPUTS`
- Fetch error, if connected to network  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| seed | <code>string</code> |  |  |
| transfers | <code>object</code> |  |  |
| [options] | <code>object</code> |  |  |
| [options.inputs] | <code>Array.&lt;Input&gt;</code> |  | Inputs used for signing. Needs to have correct security, keyIndex and address value |
| [options.inputs[].address] | <code>Hash</code> |  | Input address txs |
| [options.inputs[].keyIndex] | <code>number</code> |  | Key index at which address was generated |
| [options.inputs[].security] | <code>number</code> | <code>2</code> | Security level |
| [options.inputs[].balance] | <code>number</code> |  | Balance in iotas |
| [options.address] | <code>Hash</code> |  | Remainder address |
| [options.security] | <code>Number</code> |  | Security level to be used for getting inputs and reminder address |
| [callback] | <code>function</code> |  | Optional callback |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [options.hmacKey] | <code>Hash</code> | HMAC key used for attaching an HMAC |

Prepares the transaction txs by generating a bundle, filling in transfers and inputs,
adding remainder and signing. It can be used to generate and sign bundles either online or offline.
For offline usage, please see [`createPrepareTransfers`](#module_core.createPrepareTransfers)
which creates a `prepareTransfers` without a network provider.

<a name="module_core.createPromoteTransaction"></a>

### *core*.createPromoteTransaction(provider, [attachFn])

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |
| [attachFn] | <code>function</code> | Optional `AttachToTangle` function to override the [default method](#module_core.attachToTangle). |

**Returns**: <code>function</code> - [`promoteTransaction`](#module_core.promoteTransaction)  
<a name="module_core.promoteTransaction"></a>

### *core*.promoteTransaction(tail, depth, minWeightMagnitude, transfer, [options], [callback])
**Fulfil**: <code>Transaction[]</code>  
**Reject**: <code>Error</code>
- `INCONSISTENT SUBTANGLE`: In this case promotion has no effect and reatchment is required.
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| tail | <code>string</code> |  |
| depth | <code>int</code> |  |
| minWeightMagnitude | <code>int</code> |  |
| transfer | <code>array</code> |  |
| [options] | <code>object</code> |  |
| [options.delay] | <code>number</code> | Delay between spam transactions in `ms` |
| [options.interrupt] | <code>boolean</code> \| <code>function</code> | Interrupt signal, which can be a function that evaluates to boolean |
| [callback] | <code>function</code> |  |

Promotes a transaction by adding other transactions (spam by default) on top of it.
Will promote `maximum` transfers on top of the current one with `delay` interval. Promotion
is interruptable through `interrupt` option.

<a name="module_core.createRemoveNeighbors"></a>

### *core*.createRemoveNeighbors(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`removeNeighbors`](#module_core.removeNeighbors)  
<a name="module_core.removeNeighbors"></a>

### *core*.removeNeighbors(uris, [callback])
**Fulfil**: <code>number</code> Number of neighbors that were removed  
**Reject**: <code>Error</code>
- `INVALID_URI`: Invalid uri
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| uris | <code>Array</code> | List of URI's |
| [callback] | <code>Callback</code> | Optional callback |

Removes a list of neighbors from the connected a helix node node by calling
[`removeNeighbors`](https://docs.helix.net/hlx/api#endpoints/removeNeighbors) command.
Assumes `removeNeighbors` command is available on the node.

This method has temporary effect until your a helix node node relaunches.

<a name="module_core.createReplayBundle"></a>

### *core*.createReplayBundle(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`replayBundle`](#module_core.replayBundle)  
<a name="module_core.replayBundle"></a>

### *core*.replayBundle(tail, depth, minWeightMagnitude, [callback])
**Fulfil**: <code>Transaction[]</code>  
**Reject**: <code>Error</code>
- `INVALID_DEPTH`
- `INVALID_MIN_WEIGHT_MAGNITUDE`
- `INVALID_TRANSACTION_HASH`
- `INVALID_BUNDLE`
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| tail | <code>Hash</code> | Tail transaction hash. Tail transaction is the transaction in the bundle with `currentIndex == 0`. |
| depth | <code>number</code> | The depth at which Random Walk starts. A value of `3` is typically used by wallets, meaning that RW starts 3 milestones back. |
| minWeightMagnitude | <code>number</code> | Minimum number of trailing zeros in transaction hash. This is used by [`attachToTangle`](#module_core.attachToTangle) function to search for a valid `nonce`. MWM is currently set to `2` on the testnet. |
| [callback] | <code>Callback</code> | Optional callback |

Reattaches a transfer to tangle by selecting tips & performing the Proof-of-Work again.
Reattachments are usefull in case original transactions are pending, and can be done securely
as many times as needed.

**Example**  
```js
replayBundle(tail)
  .then(transactions => {
    // ...
  })
  .catch(err => {
    // ...
  })
})
```
<a name="module_core.createSendTransactionStrings"></a>

### *core*.createSendTransactionStrings(provider)


| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`sendTransactionStrings`](#module_core.sendTransactionStrings)  
<a name="module_core.sendTransactionStrings"></a>

### *core*.sendTransactionStrings(txs, depth, minWeightMagnitude, [reference], [callback])
**Fulfil**: <code>Transaction[]</code>  Returns list of attached transactions  
**Reject**: <code>Error</code>
- `INVALID_TRANSACTION_TRYTES`
- `INVALID_DEPTH`
- `INVALID_MIN_WEIGHT_MAGNITUDE`
- Fetch error, if connected to network  

| Param | Type | Description |
| --- | --- | --- |
| txs | <code>Array.&lt;TxHex&gt;</code> | List of transactions (txs) to attach, store & broadcast |
| depth | <code>number</code> | Depth |
| minWeightMagnitude | <code>number</code> | Min weight magnitude |
| [reference] | <code>string</code> | Optional reference hash |
| [callback] | <code>Callback</code> | Optional callback |

[Attaches to tanlge](#module_core.attachToTangle), [stores](#module_core.storeTransactions)
and [broadcasts](#module_core.broadcastTransactions) a list of transaction txs.


**Example**  
```js
prepareTransfers(seed, transfers)
  .then(txs => sendTransactionStrings(txs, depth, minWeightMagnitude))
  .then(transactions => {
    // ...
  })
  .catch(err => {
    // ...
  })
```
<a name="module_core.createStoreAndBroadcast"></a>

### *core*.createStoreAndBroadcast(provider)

| Param | Type |
| --- | --- |
| provider | <code>Provider</code> |

**Returns**: <code>function</code> - [`storeAndBroadcast`](#module_core.storeAndBroadcast)  
<a name="module_core.storeAndBroadcast"></a>

### *core*.storeAndBroadcast(txs, [callback])
**Fulfill**: <code>TxHex[]</code> Attached txs
**Reject**: <code>Error</code>
- `INVALID_ATTACHED_TRYTES`: Invalid attached txs
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |
| txs | <code>Array.&lt;TxHex&gt;</code> | Attached transaction txs |
| [callback] | <code>Callback</code> | Optional callback |

Stores and broadcasts a list of _attached_ transaction txs by calling
[`storeTransactions`](#module_core.storeTransactions) and
[`broadcastTransactions`](#module_core.broadcastTransactions).

Note: Persist the transactions (txs)) in local storage **before** calling this command, to ensure
that reattachment is possible, until your bundle has been included.

Any transactions stored with this command will eventaully be erased, as a result of a snapshot.

<a name="module_core.createStoreTransactions"></a>

### *core*.createStoreTransactions(provider)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | Network provider |

**Returns**: <code>function</code> - [`storeTransactions`](#module_core.storeTransactions)  
<a name="module_core.storeTransactions"></a>

### *core*.storeTransactions(txs, [callback])
**Fulfill**: <code>TxHex[]</code> Attached transaction txs  
**Reject**: <code>Error</code>
- `INVALID_ATTACHED_TRYTES`: Invalid attached txs
- Fetch error  

| Param | Type | Description |
| --- | --- | --- |

| txs | <code>Array.&lt;TxHex&gt;</code> | Attached transaction txs |
| [callback] | <code>Callback</code> | Optional callback |

Persists a list of _attached_ transactions (txs) in the store of the connected node by calling
[`storeTransactions`](https://docs.hlx.ai/hlx/api#endpoints/storeTransactions) command.
Tip selection and Proof-of-Work must be done first, by calling
[`getTransactionsToApprove`](#module_core.getTransactionsToApprove) and
[`attachToTangle`](#module_core.attachToTangle) or an equivalent attach method or remote
[`PoWbox`](https://powbox.devnet.iota.org/).


Persist the transactions (txs) in local storage **before** calling this command, to ensure
reattachment is possible, until your bundle has been included.

Any transactions stored with this command will eventually be erased, as a result of a snapshot.

<a name="module_core.createTraverseBundle"></a>

### *core*.createTraverseBundle(provider)

| Param | Type |
| --- | --- |
| provider | <code>Provider</code> |

**Returns**: <code>function</code> - [`traverseBundle`](#module_core.traverseBundle)  
<a name="module_core.traverseBundle"></a>

### *core*.traverseBundle(trunkTransaction, [bundle], [callback])
**Fulfil**: <code>Transaction[]</code> Bundle as array of transaction objects  
**Reject**: <code>Error</code>
- `INVALID_TRANSACTION_HASH`
- `INVALID_TAIL_HASH`: Provided transaction is not tail (`currentIndex !== 0`)
- `INVALID_BUNDLE`: Bundle is syntactically invalid
- Fetch error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| trunkTransaction | <code>Hash</code> |  | Trunk transaction, should be tail (`currentIndex == 0`) |
| [bundle] | <code>Hash</code> | <code>[]</code> | List of accumulated transactions |
| [callback] | <code>Callback</code> |  | Optional callback |

Fetches the bundle of a given the _tail_ transaction hash, by traversing through `trunkTransaction`.
It does not validate the bundle.

**Example**  
```js
traverseBundle(tail)
   .then(bundle => {
       // ...
   })
   .catch(err => {
       // handle errors
   })
```
<a name="module_core.generateAddress"></a>

### *core*.generateAddress(seed, index, [security], [checksum])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| seed | <code>string</code> |  |  |
| index | <code>number</code> |  | Private key index |
| [security] | <code>number</code> | <code>2</code> | Security level of the private key |
| [checksum] | <code>boolean</code> | <code>false</code> | Flag to add 4 txs checksum |

Generates an address deterministically, according to the given seed, index and security level.

**Returns**: <code>Hash</code> - Address txs  
<a name="module_extract-json"></a>

## extract-json
<a name="module_extract-json..extractJson"></a>

### *extract-json*~extractJson(bundle)

| Param | Type |
| --- | --- |
| bundle | <code>array</code> |

Takes a bundle as input and from the signatureMessageFragments extracts the correct JSON
data which was encoded and sent with the transaction.
Supports the following forms of JSON encoded values:
- `"{ \"message\": \"hello\" }"\`
- `"[1, 2, 3]"`
- `"true"`, `"false"` & `"null"`
- `"\"hello\""
- `123`

**Example**  
```js
try {
  const msg = JSON.parse(extractJson(bundle))
} catch (err) {
  err.msg == errors.INVALID_BUNDLE
  // Invalid bundle or invalid encoded JSON
}
```
**Example**  
Example with `getBundle`:

```js
getBundle(tailHash)
  .then(bunlde => {
     const msg = JSON.parse(extractJson(bundle))
     // ...
  })
  .catch((err) => {
     // Handle network & extraction errors
  })
```
<a name="module_http-client"></a>

## http-client

* [http-client](#module_http-client)

    * _static_
        * [.send(command, [uri], [apiVersion])](#module_http-client.send)

    * _inner_
        * [~send](#module_http-client..send)

        * [~setSettings](#module_http-client..setSettings)

        * [~createHttpClient([settings])](#module_http-client..createHttpClient)


<a name="module_http-client.send"></a>

### *http-client*.send(command, [uri], [apiVersion])
**Fulil**: <code>Object</code> - Response  
**Reject**: <code>Error</code> - Request error  

| Param | Type | Default |
| --- | --- | --- |
| command | <code>Command</code> |  |
| [uri] | <code>String</code> | <code>http://localhost:14700</code> |
| [apiVersion] | <code>String</code> \| <code>Number</code> | <code>1</code> |

Sends an http request to a specified host.

**Returns**: Promise  
<a name="module_http-client..send"></a>

### *http-client*~send

| Param | Type |
| --- | --- |
| command | <code>object</code> |

**Returns**: <code>object</code> - response  
<a name="module_http-client..setSettings"></a>

### *http-client*~setSettings

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>object</code> | <code>{}</code> |  |
| [settings.provider] | <code>string</code> | <code>&quot;http://localhost:14700&quot;</code> | Uri of a helix node node |
| [settings.apiVersion] | <code>string</code> \| <code>number</code> | <code>1</code> | Helix Api version to be sent as `X-HELIX-API-Version` header. |
| [settings.requestBatchSize] | <code>number</code> | <code>1000</code> | Number of search values per request. |

<a name="module_http-client..createHttpClient"></a>

### *http-client*~createHttpClient([settings])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>object</code> | <code>{}</code> |  |
| [settings.provider] | <code>string</code> | <code>&quot;http://localhost:14700&quot;</code> | Uri of a helix node node |
| [settings.apiVersion] | <code>string</code> \| <code>number</code> | <code>1</code> | Helix Api version to be sent as `X-HELIX-API-Version` header. |
| [settings.requestBatchSize] | <code>number</code> | <code>1000</code> | Number of search values per request. |

Create an http client to access a helix node http API.

**Returns**: Object  
<a name="module_multisig"></a>

## multisig

* [multisig](#module_multisig)

    * [.Address](#module_multisig.Address)

    * [.Multisig](#module_multisig.Multisig)


<a name="module_multisig.Address"></a>

### *multisig*.Address
<a name="module_multisig.Multisig"></a>

### *multisig*.Multisig
<a name="module_signing"></a>

## signing

* [signing](#module_signing)

    * [~subseed(seed, index)](#module_signing..subseed)

    * [~key(subseed, length)](#module_signing..key)

    * [~digests(key)](#module_signing..digests)

    * [~address(digests)](#module_signing..address)

    * [~digest(normalizedBundleFragment, signatureFragment)](#module_signing..digest)

    * [~signatureFragment(normalizeBundleFragment, keyFragment)](#module_signing..signatureFragment)

    * [~validateSignatures(expectedAddress, signatureFragments, bundleHash)](#module_signing..validateSignatures)

    * [~normalizedBundleHash(bundlehash)](#module_signing..normalizedBundleHash)


<a name="module_signing..subseed"></a>

### *signing*~subseed(seed, index)

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>Int8Array</code> | Seed txBits |
| index | <code>number</code> | Private key index |

**Returns**: <code>Int8Array</code> - subseed txBits  
<a name="module_signing..key"></a>

### *signing*~key(subseed, length)

| Param | Type | Description |
| --- | --- | --- |
| subseed | <code>Int8Array</code> | Subseed txBits |
| length | <code>number</code> | Private key length |

**Returns**: <code>Int8Array</code> - Private key txBits  
<a name="module_signing..digests"></a>

### *signing*~digests(key)

| Param | Type | Description |
| --- | --- | --- |
| key | <code>Int8Array</code> | Private key txBits |

<a name="module_signing..address"></a>

### *signing*~address(digests)

| Param | Type | Description |
| --- | --- | --- |
| digests | <code>Int8Array</code> | Digests txBits |

**Returns**: <code>Int8Array</code> - Address txBits  
<a name="module_signing..digest"></a>

### *signing*~digest(normalizedBundleFragment, signatureFragment)

| Param | Type | Description |
| --- | --- | --- |
| normalizedBundleFragment | <code>array</code> | Normalized bundle fragment |
| signatureFragment | <code>Int8Array</code> | Signature fragment txBits |

**Returns**: <code>Int8Array</code> - Digest txBits  
<a name="module_signing..signatureFragment"></a>

### *signing*~signatureFragment(normalizeBundleFragment, keyFragment)

| Param | Type | Description |
| --- | --- | --- |
| normalizeBundleFragment | <code>array</code> | normalized bundle fragment |
| keyFragment | <code>keyFragment</code> | key fragment txBits |

**Returns**: <code>Int8Array</code> - Signature Fragment txBits  
<a name="module_signing..validateSignatures"></a>

### *signing*~validateSignatures(expectedAddress, signatureFragments, bundleHash)

| Param | Type | Description |
| --- | --- | --- |
| expectedAddress | <code>string</code> | Expected address txs |
| signatureFragments | <code>array</code> | Array of signatureFragments txs |
| bundleHash | <code>string</code> | Bundle hash txs |

<a name="module_signing..normalizedBundleHash"></a>

### *signing*~normalizedBundleHash(bundlehash)

| Param | Type | Description |
| --- | --- | --- |
| bundlehash | <code>Hash</code> | Bundle hash txs |

Normalizes the bundle hash, with resulting digits summing to zero.

**Returns**: <code>Int8Array</code> - Normalized bundle hash  
<a name="module_transaction-converter"></a>

## transaction-converter

* [transaction-converter](#module_transaction-converter)

    * [~asTransactionStrings(transactions)](#module_transaction-converter..asTransactionStrings)

    * [~asTransactionObject(txs)](#module_transaction-converter..asTransactionObject)

    * [~asTransactionObjects([hashes])](#module_transaction-converter..asTransactionObjects)

    * [~transactionObjectsMapper(txs)](#module_transaction-converter..transactionObjectsMapper)


<a name="module_transaction-converter..asTransactionTxHex"></a>

### *transaction-converter*~asTransactionStrings(transactions)

| Param | Type | Description |
| --- | --- | --- |
| transactions | <code>Transaction</code> \| <code>Array.&lt;Transaction&gt;</code> | Transaction object(s) |

Converts a transaction object or a list of those into transaction hex strings.

**Returns**: <code>txs</code> \| <code>Array.&lt;TxHex&gt;</code> - Transaction hex strings  
<a name="module_transaction-converter..asTransactionObject"></a>

### *transaction-converter*~asTransactionObject(txs)

| Param | Type | Description |
| --- | --- | --- |
| txs | <code>TxHex</code> | Transaction txs |

Converts transaction txs of 768
 txs into a transaction object.

**Returns**: <code>Transaction</code> - Transaction object  
<a name="module_transaction-converter..asTransactionObjects"></a>

### *transaction-converter*~asTransactionObjects([hashes])

| Param | Type | Description |
| --- | --- | --- |
| [hashes] | <code>Array.&lt;Hash&gt;</code> | Optional list of known hashes. Known hashes are directly mapped to transaction objects, otherwise all hashes are being recalculated. |


Converts a list of transaction txs into list of transaction objects.

Accepts a list of hashes and returns a mapper. In cases hashes are given,
the mapper function map them to converted objects.

**Returns**: <code>function</code> - [`transactionObjectsMapper`](#module_transaction.transactionObjectsMapper)  
<a name="module_transaction-converter..transactionObjectsMapper"></a>

### *transaction-converter*~transactionObjectsMapper(txs)

| Param | Type | Description |
| --- | --- | --- |
| txs | <code>Array.&lt;TxHex&gt;</code> | List of transactions (txs) to convert |


Maps the list of given hashes to a list of converted transaction objects.

**Returns**: <code>Array.&lt;Transaction&gt;</code> - List of transaction objects with hashes  
<a name="module_transaction"></a>

## transaction

* [transaction](#module_transaction)

    * [~transactionHash(txBytes)](#module_transaction..transactionHash)

    * [~isTransaction(tx)](#module_transaction..isTransaction)

    * [~isTailTransaction(transaction)](#module_transaction..isTailTransaction)

    * [~isTransactionHash(hash, mwm)](#module_transaction..isTransactionHash)

    * [~isTransactionTxHex(txs, minWeightMagnitude)](#module_transaction..isTransactionTxHex)

    * [~isAttachedTxHex(txs)](#module_transaction..isAttachedTxHex)


<a name="module_transaction..transactionHash"></a>

### *transaction*~transactionHash(txBytes)

| Param | Type | Description |
| --- | --- | --- |
| txBits | <code>Int8Array</code> | Int8Array of 6144
 transaction txBits |

Calculates the transaction hash out of 6144
 transaction txBits.

**Returns**: <code>Hash</code> - Transaction hash  
<a name="module_transaction..isTransaction"></a>

### *transaction*~isTransaction(tx)

| Param | Type |
| --- | --- |
| tx | <code>object</code> |

Checks if input is valid transaction object.

<a name="module_transaction..isTailTransaction"></a>

### *transaction*~isTailTransaction(transaction)

| Param | Type |
| --- | --- |
| transaction | <code>object</code> |

Checks if given transaction object is tail transaction.
A tail transaction is one with `currentIndex=0`.

<a name="module_transaction..isTransactionHash"></a>

### *transaction*~isTransactionHash(hash, mwm)

| Param | Type |
| --- | --- |
| hash | <code>string</code> |
| mwm | <code>number</code> |

Checks if input is correct transaction hash (32 txs)

<a name="module_transaction..isTransactionTxHex"></a>

### *transaction*~isTransactionTxHex(txs, minWeightMagnitude)

| Param | Type |
| --- | --- |
| txs | <code>string</code> |
| minWeightMagnitude | <code>number</code> |

Checks if input is correct transaction txs (768
 txs)

<a name="module_transaction..isAttachedTxHex"></a>

### *transaction*~isAttachedTxHex(txs)

| Param | Type |
| --- | --- |
| txs | <code>string</code> |

Checks if input is valid attached transaction txs.
For attached transactions last 48 txs are non-zero.


<a name="module_unit-converter"></a>

## unit-converter
<a name="module_unit-converter..convertUnits"></a>

### *unit-converter*~convertUnits(value, fromUnit, toUnit)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>int</code> \| <code>float</code> |  |
| fromUnit | <code>string</code> | Name of original value unit |
| toUnit | <code>string</code> | Name of unit wich we convert to |

Converts accross HLX units. Valid unit names are:
`h`, `Kh`, `Mh`, `Gh`, `Th`, `Ph`

<a name="module_validators"></a>

## validators
<a name="module_validators..isAddress"></a>

### *validators*~isAddress(address)

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | Address txs, with checksum |

Checks integrity of given address by validating the checksum.

<a name="API"></a>

## API

* [API](#API)

    * [.setSettings(settings)](#API.setSettings)

    * [.overrideAttachToTangle(attachToTangle)](#API.overrideAttachToTangle)


<a name="API.setSettings"></a>

### *API*.setSettings(settings)

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>object</code> | Provider settings object |
| [settings.provider] | <code>string</code> | Http `uri` of a helix node node |
| [settings.attachToTangle] | <code>function</code> | Function to override [`attachToTangle`](#module_core.attachToTangle) with |

Defines network provider configuration and [`attachToTangle`](#module_core.attachToTangle) method.

<a name="API.overrideAttachToTangle"></a>

### *API*.overrideAttachToTangle(attachToTangle)

| Param | Type | Description |
| --- | --- | --- |
| attachToTangle | <code>function</code> | Function to override [`attachToTangle`](#module_core.attachToTangle) with |

Overides default [`attachToTangle`](#module_core.attachToTangle) with a local equivalent or
[`PoWBox`](https://powbox.devnet.iota.org/)
