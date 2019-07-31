# @helixnetwork/transaction-converter

Methods for calculating transaction hashes and converting transaction objects to transaction txs and back.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @helixnetwork/transaction-converter
```

or using [yarn](https://yarnpkg.com/):

```
yarn add @helixnetwork/transaction-converter
```

## API Reference

    
* [transaction-converter](#module_transaction-converter)

    * [~asTransactionStrings(transactions)](#module_transaction-converter..asTransactionStrings)

    * [~asTransactionObject(txs)](#module_transaction-converter..asTransactionObject)

    * [~asTransactionObjects([hashes])](#module_transaction-converter..asTransactionObjects)

    * [~transactionObjectsMapper(txs)](#module_transaction-converter..transactionObjectsMapper)


<a name="module_transaction-converter..asTransactionStrings"></a>

### *transaction-converter*~asTransactionStrings(transactions)

| Param | Type | Description |
| --- | --- | --- |
| transactions | <code>Transaction</code> \| <code>Array.&lt;Transaction&gt;</code> | Transaction object(s) |

Converts a transaction object or a list of those into transaction txs.

**Returns**: <code>HBytes</code> \| <code>Array.&lt;HBytes&gt;</code> - Transaction txs  
<a name="module_transaction-converter..asTransactionObject"></a>

### *transaction-converter*~asTransactionObject(txs)

| Param | Type | Description |
| --- | --- | --- |
| txs | <code>HBytes</code> | Transaction txs |

Converts transaction txs of 2673 txs into a transaction object.

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
| txs | <code>Array.&lt;HBytes&gt;</code> | List of transaction txs to convert |

Maps the list of given hashes to a list of converted transaction objects.

**Returns**: <code>Array.&lt;Transaction&gt;</code> - List of transaction objects with hashes  
