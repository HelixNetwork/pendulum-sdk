# @helixnetwork/bundle

Utilities for generating and schnorr bundles.
A bundle in HELIX is an atomic set of transactions.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @helixnetwork/bundle
```

or using [yarn](https://yarnpkg.com/):

```
yarn add @helixnetwork/bundle
```

## API Reference


* [bundle](#module_bundle)

    * [~createBundle(entries)](#module_bundle..createBundle)

    * [~addEntry(transactions, entry)](#module_bundle..addEntry)

    * [~addHBytes(transactions, fragments, [offset])](#module_bundle..addHBytes)

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
| [entry.address] | <code>string</code> |  | Address, defaults to all-9s |
| [entry.value] | <code>number</code> | <code>0</code> | Value to transfer in _HLX_ |
| [entry.signatureMessageFragments] | <code>Array.&lt;string&gt;</code> |  | Array of signature message fragments hbytes, defaults to all-9s |
| [entry.timestamp] | <code>number</code> |  | Transaction timestamp, defaults to `Math.floor(Date.now() / 1000)` |
| [entry.tag] | <code>string</code> |  | Optional Tag, defaults to null tag (all-9s) |

Creates a bunlde with given transaction entries

**Returns**: <code>Array.&lt;Transaction&gt;</code> - Bundle  
<a name="module_bundle..addHBytes"></a>

### *bundle*~addHBytes(transactions, fragments, [offset])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| transactions | <code>Array.&lt;Transaction&gt;</code> |  | Transactions in the bundle |
| fragments | <code>Array.&lt;HBytes&gt;</code> |  | Message signature fragments to add |
| [offset] | <code>number</code> | <code>0</code> | Optional offset to start appending signature message fragments |

Adds a list of hbytes in the bundle starting at offset

**Returns**: <code>Array.&lt;Transaction&gt;</code> - Transactions of finalized bundle  
<a name="module_bundle..finalizeBundle"></a>

### *bundle*~finalizeBundle(transactions)

| Param | Type | Description |
| --- | --- | --- |
| transactions | <code>Array.&lt;Transaction&gt;</code> | Transactions in the bundle |

Finalizes the bundle by calculating the bundle hash

**Returns**: <code>Array.&lt;Transaction&gt;</code> - Transactions of finalized bundle  
