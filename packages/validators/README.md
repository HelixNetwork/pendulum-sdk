
.# @helixnetwork/validators

Collection of guards and validators, useful in Helix development.

## Installation

Instal using [npm](https://www.npmjs.org/):
```
npm install @helixnetwork/validators
```

or using [yarn](https://yarnpkg.com/):

```
yarn add @helixnetwork/validators
```

## API Reference

    
* [validators](#module_validators)

    * [~isTxHex(TxHex, [length])](#module_validators..isTxHex)

    * [~isTxHexOfExactLength(TxHex, length)](#module_validators..isTxHexOfExactLength)

    * [~isTxHexOfMaxLength(TxHex, length)](#module_validators..isTxHexOfMaxLength)

    * [~isEmpty(hash)](#module_validators..isEmpty)

    * [~isEmptyBytes(bytes)](#module_validators..isEmptyBytes)

    * [~isHash(hash)](#module_validators..isHash)

    * [~isAddress(hash)](#module_validators..isAddress)

    * [~isInput(address)](#module_validators..isInput)

    * [~isTag(tag)](#module_validators..isTag)

    * [~isTransfer(transfer)](#module_validators..isTransfer)

    * [~isUri(uri)](#module_validators..isUri)

    * [~validate()](#module_validators..validate)

    * [~isAddress(address)](#module_validators..isAddress)


<a name="module_validators..isTxHex"></a>


### *validators*~isTxHex(txs, [length])

| Param | Type | Default |
| --- | --- | --- |
| txs | <code>string</code> |  | 
| [length] | <code>string</code> \| <code>number</code> | <code>&quot;&#x27;1,&#x27;&quot;</code> | 

Checks if input is correct TxHex consisting of [0-9A-F]; optionally validate length

<a name="module_validators..isTxHexOfExactLength"></a>

### *validators*~isTxHexOfExactLength(txs, length)

| Param | Type |
| --- | --- |
| txs | <code>string</code> | 
| length | <code>number</code> | 

<a name="module_validators..isTxHexOfMaxLength"></a>

### *validators*~isTxHexOfMaxLength(txs, length)

| Param | Type |
| --- | --- |
| txs | <code>string</code> | 
| length | <code>number</code> | 

<a name="module_validators..isEmpty"></a>

### *validators*~isEmpty(hash)

| Param | Type |
| --- | --- |
| hash | <code>string</code> | 

Checks if input contains `0`s only.

<a name="module_validators..isEmptyBytes"></a>

### *validators*~isEmptyBytes(bytes)

| Param | Type |
| --- | --- |
| bytes | <code>TxBytes</code> | 

Checks if input contains `0`s only.

<a name="module_validators..isHash"></a>

### *validators*~isHash(hash)

| Param | Type |
| --- | --- |
| hash | <code>TxHex</code> | 

Checks if input is correct hash (64 txs) or address with checksum (72 txs)

<a name="module_validators..isAddress"></a>

### *validators*~isAddress(hash)

| Param | Type |
| --- | --- |
| hash | <code>string</code> | 

Checks if input is correct address or address with checksum (72 txs)

<a name="module_validators..isInput"></a>

### *validators*~isInput(address)

| Param | Type |
| --- | --- |
| address | <code>TxHex</code> | 

Checks if input is valid input object. Address can be passed with or without checksum.
It does not validate the checksum.

<a name="module_validators..isTag"></a>

### *validators*~isTag(tag)

| Param | Type |
| --- | --- |
| tag | <code>TxHex</code> | 

Checks that input is valid tag txs.

<a name="module_validators..isTransfer"></a>

### *validators*~isTransfer(transfer)

| Param | Type |
| --- | --- |
| transfer | <code>Transfer</code> | 

Checks if input is valid `transfer` object.

<a name="module_validators..isUri"></a>

### *validators*~isUri(uri)

| Param | Type |
| --- | --- |
| uri | <code>string</code> | 

Checks that a given `URI` is valid

Valid Examples:
- `udp://[2001:db8:a0b:12f0::1]:14265`
- `udp://[2001:db8:a0b:12f0::1]`
- `udp://8.8.8.8:14265`
- `udp://domain.com`
- `udp://domain2.com:14265`

<a name="module_validators..validate"></a>

### *validators*~validate()
**Throws**:

- <code>Error</code> error

Runs each validator in sequence, and throws on the first occurence of invalid data.
Validators are passed as arguments and executed in given order.
You might want place `validate()` in promise chains before operations that require valid inputs,
taking advantage of built-in promise branching.

**Example**  
```js
try {
  validate([
    value, // Given value
    isTxHex, // Validator function
    'Invalid TxHex' // Error message
  ])
} catch (err) {
  console.log(err.message) // 'Invalid TxHex'
}
```
<a name="module_validators..isAddress"></a>

### *validators*~isAddress(address)

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | Address txs, with checksum |

Checks integrity of given address by validating the checksum.

