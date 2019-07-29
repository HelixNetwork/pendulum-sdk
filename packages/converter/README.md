# @helixnetwork/converter

Methods for converting ascii values to txHex, hbits and back.

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

    * [.txHexToAscii(txHex)](#module_converter.txHexToAscii)

    * [.hbits(input)](#module_converter.hbits)

    * [.txHex(hBits)](#module_converter.txHex)

    * [.value(hBits)](#module_converter.value)

    * [.fromValue(value)](#module_converter.fromValue)

    * [.toBytes(value, padding)](#module_converter.toBytes)


<a name="module_converter.asciiToTxHex"></a>

### *converter*.asciiToTxHex(input)

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> | ascii input |

Converts an ascii encoded string to txHex.

### How conversion works:

An ascii value of `1 Byte` can be represented in `2 TxHex`:

1. We get the decimal unicode value of an individual ASCII character this code can be represented in a Byte

2. Decimal value is then converted into hexadecimal value

### Example:

Lets say we want to convert ascii character `Z`.

1. `Z` has a decimal unicode value of `90`.

2. `90` in hexadecimal is 5a

Therefore ascii character `Z` is represented as `IC` in 5a.

**Returns**: <code>string</code> - string of txHex  
<a name="module_converter.txHexToAscii"></a>

### *converter*.txHexToAscii(txHex)

| Param | Type | Description |
| --- | --- | --- |
| txHex | <code>string</code> | txHex |

Converts txHex of _even_ length to an ascii string

**Returns**: <code>string</code> - string in ascii  
<a name="module_converter.hbits"></a>

### *converter*.hbits(input)

| Param | Type | Description |
| --- | --- | --- |
| input | <code>String</code> \| <code>Number</code> | HByte string or value to be converted. |

Converts txHex or values to hbits

**Returns**: <code>Int8Array</code> - hbits  
<a name="module_converter.txHex"></a>

### *converter*.txHex(hBits)

| Param | Type |
| --- | --- |
| hBits | <code>Int8Array</code> | 

Converts hbits to txHex

**Returns**: <code>String</code> - txHex  
<a name="module_converter.value"></a>

### *converter*.value(hBits)

| Param | Type |
| --- | --- |
| hBits | <code>Int8Array</code> | 

Converts hbits into an integer value

<a name="module_converter.fromValue"></a>

### *converter*.fromValue(value)

| Param | Type |
| --- | --- |
| value | <code>Number</code> | 

Converts an integer value to hbits

**Returns**: <code>Int8Array</code> - hbits  
<a name="module_converter.toBytes"></a>

### *converter*.toBytes(value, padding)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> |  |
| padding | <code>number</code> | Ł |

Converts an integer value to byte array

**Returns**: <code>Uint8Array</code> - bytes  
