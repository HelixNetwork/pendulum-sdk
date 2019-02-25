# @helixnetwork/transaction-converter

Methods for calculating transaction hashes and converting transaction objects to transaction trytes and back.

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

    * [~asTransactionHBytes(transactions)](#module_transaction-converter..asTransactionHBytes)

    * [~asTransactionObject(hbytes)](#module_transaction-converter..asTransactionObject)

    * [~asTransactionObjects([hashes])](#module_transaction-converter..asTransactionObjects)

    * [~transactionObjectsMapper(hbytes)](#module_transaction-converter..transactionObjectsMapper)


<a name="module_transaction-converter..asTransactionHBytes"></a>

### *transaction-converter*~asTransactionHBytes(transactions)

| Param | Type | Description |
| --- | --- | --- |
| transactions | <code>Transaction</code> \| <code>Array.&lt;Transaction&gt;</code> | Transaction object(s) |

Converts a transaction object or a list of those into transaction hbytes.

**Returns**: <code>HBytes</code> \| <code>Array.&lt;HBytes&gt;</code> - Transaction hbytes  
<a name="module_transaction-converter..asTransactionObject"></a>

### *transaction-converter*~asTransactionObject(hbytes)

| Param | Type | Description |
| --- | --- | --- |
| hbytes | <code>HBytes</code> | Transaction hbytes |

Converts transaction hbytes of 2673 hbytes into a transaction object.

**Returns**: <code>Transaction</code> - Transaction object  
<a name="module_transaction-converter..asTransactionObjects"></a>

### *transaction-converter*~asTransactionObjects([hashes])

| Param | Type | Description |
| --- | --- | --- |
| [hashes] | <code>Array.&lt;Hash&gt;</code> | Optional list of known hashes. Known hashes are directly mapped to transaction objects, otherwise all hashes are being recalculated. |

Converts a list of transaction hbytes into list of transaction objects.
Accepts a list of hashes and returns a mapper. In cases hashes are given,
the mapper function map them to converted objects.

**Returns**: <code>function</code> - [`transactionObjectsMapper`](#module_transaction.transactionObjectsMapper)  
<a name="module_transaction-converter..transactionObjectsMapper"></a>

### *transaction-converter*~transactionObjectsMapper(hbytes)

| Param | Type | Description |
| --- | --- | --- |
| hbytes | <code>Array.&lt;HBytes&gt;</code> | List of transaction hbytes to convert |

Maps the list of given hashes to a list of converted transaction objects.

**Returns**: <code>Array.&lt;Transaction&gt;</code> - List of transaction objects with hashes  
