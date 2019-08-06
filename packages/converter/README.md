# @helixnetwork/converter

Methods for converting ascii values to txHex, txBits and back.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @helixnetwork/converter
```

or using [yarn](https://yarnpkg.com/):

```
yarn add @helixnetwork/converter
```

## API Reference


* [converter](#module_converter)

    * [.asciiToTxHex(input)](#module_converter.asciiToTxHex)

    * [.txsToAscii(txs)](#module_converter.txHexToAscii)

    * [.txBits(input)](#module_converter.txBits)

    * [.txs(txBytes)](#module_converter.txHex)

    * [.value(txBits)](#module_converter.value)

    * [.fromValue(value)](#module_converter.fromValue)

    * [.toTxBytes(value, padding)](#module_converter.toBytes)


The following data types are used in this packages:
TxBits - which represents and array of bits, stored in a Int8Array object.
TxBytes - which represents and array of unsigned bytes, stored in a Uint8Array object
TxHex - which represents the hexadecima string, because of this should contain only 0-91-f and should have a even length. 


<a name="module_converter.asciiToTxHex"></a>

### *converter*.asciiToTxHex(input)

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> | ascii input |


Converts an ascii encoded string to txs.

### How conversion works:

An ascii value of `1 Byte` can be represented in `2` hexadecimal characters:


1. We get the decimal unicode value of an individual ASCII character this code can be represented in a Byte

2. Decimal value is then converted into hexadecimal value

### Example:

Lets say we want to convert ascii character `Z`.

1. `Z` has a decimal unicode value of `90`.

2. `90` in hexadecimal is 5a

Therefore ascii character `Z` is represented as `5a` in TxHex.

**Returns**: <code>string</code> - string of txs  
<a name="module_converter.txsToAscii"></a>

### *converter*.txsToAscii(txs)

| Param | Type | Description |
| --- | --- | --- |
| txs | <code>string</code> | txs |

Converts txs of _even_ length to an ascii string


**Returns**: <code>string</code> - string in ascii  
<a name="module_converter.txBits"></a>

### *converter*.txBits(input)

| Param | Type | Description |
| --- | --- | --- |
| input | <code>TxHex</code> \ <code>Number</code> | TxHex or value to be converted. |


Converts txs or values to txBits

**Returns**: <code>Int8Array</code> - txBits  
<a name="module_converter.txs"></a>

### *converter*.txs(hBits)

| Param | Type |
| --- | --- |
| hBits | <code>Int8Array</code> |

Converts txBits to txs

**Returns**: <code>String</code> - txs  

<a name="module_converter.value"></a>

### *converter*.value(txBits)

| Param | Type |
| --- | --- |
| txBits | <code>Int8Array</code> |


Converts txBits into an integer value

<a name="module_converter.fromValue"></a>

### *converter*.fromValue(value)

| Param | Type |
| --- | --- |
| value | <code>Number</code> |


Converts an integer value to txBits

**Returns**: <code>Int8Array</code> - txBits  

<a name="module_converter.toBytes"></a>

### *converter*.toTxBytes(value, padding)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | Value that should be converted |
| padding | <code>number</code> | Padding for the converted string |

Converts an integer value to byte array

**Returns**: <code>TxBytes</code> - txBytes  
