# @helixnetwork/converter

Methods for converting ascii values to txs, txBits and back.

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

    * [.asciiToTxHex(input)](#module_converter.asciiToHBytes)

    * [.txsToAscii(txs)](#module_converter.txsToAscii)

    * [.txBits(input)](#module_converter.txBits)

    * [.txs(txBits)](#module_converter.txs)

    * [.value(txBits)](#module_converter.value)

    * [.fromValue(value)](#module_converter.fromValue)

    * [.toBytes(value, padding)](#module_converter.toBytes)


<a name="module_converter.asciiToHBytes"></a>

### *converter*.asciiToHBytes(input)

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

Therefore ascii character `Z` is represented as `IC` in 5a.

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
| input | <code>String</code> \| <code>Number</code> | HByte string or value to be converted. |

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

### *converter*.value(hBits)

| Param | Type |
| --- | --- |
| hBits | <code>Int8Array</code> |

Converts txBits into an integer value

<a name="module_converter.fromValue"></a>

### *converter*.fromValue(value)

| Param | Type |
| --- | --- |
| value | <code>Number</code> |

Converts an integer value to txBits

**Returns**: <code>Int8Array</code> - txBits  
<a name="module_converter.toBytes"></a>

### *converter*.toBytes(value, padding)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> |  |
| padding | <code>number</code> | Ł |

Converts an integer value to byte array

**Returns**: <code>Uint8Array</code> - bytes  
