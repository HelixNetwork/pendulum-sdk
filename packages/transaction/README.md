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

    * [~transactionHash(hBits)](#module_transaction..transactionHash)

    * [~isTransaction(tx)](#module_transaction..isTransaction)

    * [~isTailTransaction(transaction)](#module_transaction..isTailTransaction)

    * [~isTransactionHash(hash, mwm)](#module_transaction..isTransactionHash)

    * [~isTransactionHBytes(hbytes, minWeightMagnitude)](#module_transaction..isTransactionHBytes)

    * [~isAttachedHBytes(hbytes)](#module_transaction..isAttachedHBytes)


<a name="module_transaction..transactionHash"></a>

### *transaction*~transactionHash(hBits)

| Param | Type | Description |
| --- | --- | --- |
| hBits | <code>Int8Array</code> | Int8Array of 8019 transaction hbits |

Calculates the transaction hash out of 8019 transaction hbits.

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

Checks if input is correct transaction hash (32 hbytes)

<a name="module_transaction..isTransactionHBytes"></a>

### *transaction*~isTransactionHBytes(hbytes, minWeightMagnitude)

| Param | Type |
| --- | --- |
| hbytes | <code>string</code> | 
| minWeightMagnitude | <code>number</code> | 

Checks if input is correct transaction hbytes (2673 hbytes)

<a name="module_transaction..isAttachedHBytes"></a>

### *transaction*~isAttachedHBytes(hbytes)

| Param | Type |
| --- | --- |
| hbytes | <code>string</code> | 

Checks if input is valid attached transaction hbytes.
For attached transactions last 64 hbytes are non-zero. // 241

