# @helixnetwork/signing

IOTA Signing Scheme

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @helixnetwork/signing
```

or using [yarn](https://yarnpkg.com/):

```
yarn add @helixnetwork/signing
```

## API Reference

    
* [signing](#module_signing)

    * [~subseed
Compute subseed based on the seed with an additional index(seed, index)](#module_signing..subseed
Compute subseed based on the seed with an additional index)

    * [~key
Split seed in fragments and hashed them then generate from each fragment a schnore private key;(subseed, securityLevel)](#module_signing..key
Split seed in fragments and hashed them then generate from each fragment a schnore private key;)

    * [~digests(key)](#module_signing..digests)

    * [~address(digests)](#module_signing..address)

    * [~digest(normalizedBundleFragment, signatureFragment)](#module_signing..digest)

    * [~signatureFragment(normalizeBundleFragment, keyFragment)](#module_signing..signatureFragment)

    * [~validateSignatures(expectedAddress, signatureFragments, bundleHash)](#module_signing..validateSignatures)

    * [~normalizedBundleHash(bundlehash)](#module_signing..normalizedBundleHash)


<a name="module_signing..subseed
Compute subseed based on the seed with an additional index"></a>

### *signing*~subseed
Compute subseed based on the seed with an additional index(seed, index)

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>Int8Array</code> | Seed hbits |
| index | <code>number</code> | Private key index |

**Returns**: <code>Int8Array</code> - subseed hbits  
<a name="module_signing..key
Split seed in fragments and hashed them then generate from each fragment a schnore private key;"></a>

### *signing*~key
Split seed in fragments and hashed them then generate from each fragment a schnore private key;(subseed, securityLevel)

| Param | Type | Description |
| --- | --- | --- |
| subseed | <code>Int8Array</code> | Subseed hbits |
| securityLevel | <code>number</code> | Private key length |

**Returns**: <code>Int8Array</code> - Private key bytes  
<a name="module_signing..digests"></a>

### *signing*~digests(key)

| Param | Type | Description |
| --- | --- | --- |
| key | <code>Uint8Array</code> | Private key hbits |

<a name="module_signing..address"></a>

### *signing*~address(digests)

| Param | Type | Description |
| --- | --- | --- |
| digests | <code>Int8Array</code> | Digests hbits |

**Returns**: <code>Int8Array</code> - Address hbits  
<a name="module_signing..digest"></a>

### *signing*~digest(normalizedBundleFragment, signatureFragment)

| Param | Type | Description |
| --- | --- | --- |
| normalizedBundleFragment | <code>array</code> | Normalized bundle fragment |
| signatureFragment | <code>Int8Array</code> | Signature fragment hbits |

**Returns**: <code>Int8Array</code> - Digest hbits  
<a name="module_signing..signatureFragment"></a>

### *signing*~signatureFragment(normalizeBundleFragment, keyFragment)

| Param | Type | Description |
| --- | --- | --- |
| normalizeBundleFragment | <code>array</code> | normalized bundle fragment |
| keyFragment | <code>keyFragment</code> | key fragment hbits |

**Returns**: <code>Uint8Array</code> - Signature Fragment hbits  
<a name="module_signing..validateSignatures"></a>

### *signing*~validateSignatures(expectedAddress, signatureFragments, bundleHash)

| Param | Type | Description |
| --- | --- | --- |
| expectedAddress | <code>string</code> | Expected address hbytes |
| signatureFragments | <code>array</code> | Array of signatureFragments hbytes |
| bundleHash | <code>string</code> | Bundle hash hbytes |

<a name="module_signing..normalizedBundleHash"></a>

### *signing*~normalizedBundleHash(bundlehash)

| Param | Type | Description |
| --- | --- | --- |
| bundlehash | <code>Hash</code> | Bundle hash hbytes |

Normalizes the bundle hash, with resulting digits summing to zero.

**Returns**: <code>Int8Array</code> - Normalized bundle hash  
