# @helixnetwork/schnorr

IOTA schnorr Scheme

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @helixnetwork/schnorr
```

or using [yarn](https://yarnpkg.com/):

```
yarn add @helixnetwork/schnorr
```

## API Reference

    
* [schnorr](#module_schnorr)

    * [~subseed
Compute subseed based on the seed with an additional index(seed, index)](#module_schnorr..subseed
Compute subseed based on the seed with an additional index)

    * [~key
Split seed in fragments and hashed them then generate from each fragment a schnore private key;(subseed, securityLevel)](#module_schnorr..key
Split seed in fragments and hashed them then generate from each fragment a schnore private key;)

    * [~digests(key)](#module_schnorr..digests)

    * [~address(digests)](#module_schnorr..address)

    * [~digest(normalizedBundleFragment, signatureFragment)](#module_schnorr..digest)

    * [~signatureFragment(normalizeBundleFragment, keyFragment)](#module_schnorr..signatureFragment)

    * [~validateSignatures(expectedAddress, signatureFragments, bundleHash)](#module_schnorr..validateSignatures)

    * [~normalizedBundleHash(bundlehash)](#module_schnorr..normalizedBundleHash)


<a name="module_schnorr..subseed
Compute subseed based on the seed with an additional index"></a>

### *schnorr*~subseed
Compute subseed based on the seed with an additional index(seed, index)

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>Int8Array</code> | Seed txBits |
| index | <code>number</code> | Private key index |

**Returns**: <code>Int8Array</code> - subseed txBits  
<a name="module_schnorr..key
Split seed in fragments and hashed them then generate from each fragment a schnore private key;"></a>

### *schnorr*~key
Split seed in fragments and hashed them then generate from each fragment a schnore private key;(subseed, securityLevel)

| Param | Type | Description |
| --- | --- | --- |
| subseed | <code>Int8Array</code> | Subseed txBits |
| securityLevel | <code>number</code> | Private key length |

**Returns**: <code>Int8Array</code> - Private key bytes  
<a name="module_schnorr..digests"></a>

### *schnorr*~digests(key)

| Param | Type | Description |
| --- | --- | --- |
| key | <code>Uint8Array</code> | Private key txBits |

<a name="module_schnorr..address"></a>

### *schnorr*~address(digests)

| Param | Type | Description |
| --- | --- | --- |
| digests | <code>Int8Array</code> | Digests txBits |

**Returns**: <code>Int8Array</code> - Address txBits  
<a name="module_schnorr..digest"></a>

### *schnorr*~digest(normalizedBundleFragment, signatureFragment)

| Param | Type | Description |
| --- | --- | --- |
| normalizedBundleFragment | <code>array</code> | Normalized bundle fragment |
| signatureFragment | <code>Int8Array</code> | Signature fragment txBits |

**Returns**: <code>Int8Array</code> - Digest txBits  
<a name="module_schnorr..signatureFragment"></a>

### *schnorr*~signatureFragment(normalizeBundleFragment, keyFragment)

| Param | Type | Description |
| --- | --- | --- |
| normalizeBundleFragment | <code>array</code> | normalized bundle fragment |
| keyFragment | <code>keyFragment</code> | key fragment txBits |

**Returns**: <code>Uint8Array</code> - Signature Fragment txBits  
<a name="module_schnorr..validateSignatures"></a>

### *schnorr*~validateSignatures(expectedAddress, signatureFragments, bundleHash)

| Param | Type | Description |
| --- | --- | --- |
| expectedAddress | <code>string</code> | Expected address txs |
| signatureFragments | <code>array</code> | Array of signatureFragments txs |
| bundleHash | <code>string</code> | Bundle hash txs |


<a name="module_schnorr..normalizedBundleHash"></a>

### *schnorr*~normalizedBundleHash(bundlehash)

| Param | Type | Description |
| --- | --- | --- |
| bundlehash | <code>Hash</code> | Bundle hash txs |

Normalizes the bundle hash, with resulting digits summing to zero.

**Returns**: <code>Int8Array</code> - Normalized bundle hash  
