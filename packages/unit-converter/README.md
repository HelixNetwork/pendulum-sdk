# @helixnetwork/unit-converter

Converts value across different IOTA units.

> Obsolete soon. 

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @helixnetwork/unit-converter
```

or using [yarn](https://yarnpkg.com/):

```
yarn add @helixnetwork/unit-converter
```

## API Reference

    <a name="module_unit-converter..convertUnits"></a>

### *unit-converter*~convertUnits(value, fromUnit, toUnit)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>int</code> \| <code>float</code> |  |
| fromUnit | <code>string</code> | Name of original value unit |
| toUnit | <code>string</code> | Name of unit wich we convert to |

Converts accross IOTA units. Valid unit names are:
`h`, `Kh`, `Mh`, `Gh`, `Th`, `Ph`
