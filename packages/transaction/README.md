# @helixnetwork/transaction

Utilities and validators for transactions.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @helixnetwork/transaction
```

or using [yarn](https://yarnpkg.com/):

```
yarn add @helixnetwork/transaction
```

## API Reference

    
* [transaction](#module_transaction)

    * [~transactionHash(txBytes)](#module_transaction..transactionHash)

    * [~isTransaction(tx)](#module_transaction..isTransaction)

    * [~isTailTransaction(transaction)](#module_transaction..isTailTransaction)

    * [~isTransactionHash(hash, mwm)](#module_transaction..isTransactionHash)

    * [~isTransactionTxHex(txHex, minWeightMagnitude)](#module_transaction..isTransactionTxHex)

    * [~isAttachedTxHex(txHex)](#module_transaction..isAttachedTxHex)


<a name="module_transaction..transactionHash"></a>

### *transaction*~transactionHash(txByte)

| Param | Type | Description |
| --- | --- | --- |
| hBits | <code>TxBytes</code> | TxBytes of 32 transaction bytes |

Calculates the transaction hash out of 32 transaction bytes.

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

Checks if input is correct transaction hash (32 txHex)

<a name="module_transaction..isTransactionTxHex"></a>

### *transaction*~isTransactionTxHex(txHex, minWeightMagnitude)

| Param | Type |
| --- | --- |
| txHex | <code>string</code> | 
| minWeightMagnitude | <code>number</code> | 

Checks if input is correct transaction txHex (1536 txHex)

<a name="module_transaction..isAttachedTxHex"></a>

### *transaction*~isAttachedTxHex(txHex)

| Param | Type |
| --- | --- |
| txHex | <code>string</code> | 

Checks if input is valid attached transaction txHex.
For attached transactions attached timestamp should not be zero.

