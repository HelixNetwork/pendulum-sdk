# @helixnetwork/converter

Methods for converting ascii values to hbytes, hbits and back.

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

    * [.asciiToHBytes(input)](#module_converter.asciiToHBytes)

    * [.hbytesToAscii(hbytes)](#module_converter.hbytesToAscii)

    * [.hbits(input)](#module_converter.hbits)

    * [.hbytes(hBits)](#module_converter.hbytes)

    * [.value(hBits)](#module_converter.value)

    * [.fromValue(value)](#module_converter.fromValue)

    * [.toBytes(value, padding)](#module_converter.toBytes)


<a name="module_converter.asciiToHBytes"></a>

### *converter*.asciiToHBytes(input)

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> | ascii input |

Converts an ascii encoded string to hbytes.

### How conversion works:

An ascii value of `1 Byte` can be represented in `2 HBytes`:

1. We get the decimal unicode value of an individual ASCII character this code can be represented in a Byte

2. Decimal value is then converted into hexadecimal value

### Example:

Lets say we want to convert ascii character `Z`.

1. `Z` has a decimal unicode value of `90`.

2. `90` in hexadecimal is 5a

Therefore ascii character `Z` is represented as `IC` in 5a.

**Returns**: <code>string</code> - string of hbytes  
<a name="module_converter.hbytesToAscii"></a>

### *converter*.hbytesToAscii(hbytes)

| Param | Type | Description |
| --- | --- | --- |
| hbytes | <code>string</code> | hbytes |

Converts hbytes of _even_ length to an ascii string

**Returns**: <code>string</code> - string in ascii  
<a name="module_converter.hbits"></a>

### *converter*.hbits(input)

| Param | Type | Description |
| --- | --- | --- |
| input | <code>String</code> \| <code>Number</code> | HByte string or value to be converted. |

Converts hbytes or values to hbits

**Returns**: <code>Int8Array</code> - hbits  
<a name="module_converter.hbytes"></a>

### *converter*.hbytes(hBits)

| Param | Type |
| --- | --- |
| hBits | <code>Int8Array</code> | 

Converts hbits to hbytes

**Returns**: <code>String</code> - hbytes  
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
