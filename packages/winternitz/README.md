# @helixnetwork/winternitz
Winternitz OTS (One time signature)

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @helixnetwork/winternitz
```

or using [yarn](https://yarnpkg.com/):

```
yarn add @helixnetwork/winternitz
```


## API Reference

    
* [winternitz](#module_winternitz)

    * [~subseed(seed, index)](#module_winternitz..subseed)
Compute subseed based on the seed with an additional index;

    * [~key(subSeed, securityLevel)](#module_winternitz..key)
Split seed in fragments and hashed them then generate from each fragment a schnore private key;

    * [~digests(key)](#module_winternitz..digests)

    * [~address(digests)](#module_winternitz..address)

    * [~digest(normalizedBundleFragment, signatureFragment)](#module_winternitz..digest)

    * [~signatureFragment(normalizeBundleFragment, keyFragment, normalizedBundleFragmentOffset, keyFragmentOffset)](#module_winternitz..signatureFragment)
   
    * [~signatureFragments(seeed, index, securityLevel, bundle)](#module_winternitz..signatureFragment)

    * [~validateSignatures(expectedAddress, signatureFragments, bundleHash)](#module_winternitz..validateSignatures)

    * [~normalizedBundleHash(bundlehash)](#module_winternitz..normalizedBundleHash)


### *winternitz*~subseed
Compute subseed based on the seed with an additional index(seed, index)

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>TxBytes</code> | Seed txBytes |
| index | <code>number</code> | Private key index |

**Returns**: <code>TxBytes</code> - subseed txBytes  

<a name="module_winternitz..key Split seed in fragments and hashed them then generate from each fragment a wots-s private key;"></a>

### *winternitz*~key
Split seed in fragments and hashed them then generate from each fragment a winternitz
 private key;(subSeed, securityLevel)

| Param | Type | Description |
| --- | --- | --- |
| subseed | <code>TxBytes</code> | Subseed txBytes |
| securityLevel | <code>number</code> | Private key length |

**Returns**: <code>TxBytes</code> - Private key bytes  
<a name="module_winternitz..digests"></a>

### *winternitz*~digests(key)

| Param | Type | Description |
| --- | --- | --- |
| key | <code>TxBytes</code> | Private key txBytes |

<a name="module_winternitz..address"></a>

### *winternitz*~address(digests)

| Param | Type | Description |
| --- | --- | --- |
| digests | <code>TxBytes</code> | Digests txBytes |

**Returns**: <code>TxBytes</code> - Address hbits  
<a name="module_winternitz..digest"></a>

### *winternitz*~digest(normalizedBundleFragment, signatureFragment)

| Param | Type | Description |
| --- | --- | --- |
| normalizedBundleFragment | <code>TxBytes</code> | Normalized bundle fragment |
| signatureFragment | <code>TxBytes</code> | Signature fragment txBytes |

**Returns**: <code>TxBytes</code> - Digest txBytes  
<a name="module_winternitz..signatureFragment"></a>

### *winternitz*~signatureFragment(normalizeBundleFragment, keyFragment, normalizedBundleFragmentOffset, keyFragmentOffset)

| Param | Type | Description |
| --- | --- | --- |
| normalizeBundleFragment | <code>TxBytes</code> | normalized bundle fragment |
| keyFragment | <code>TxBytes</code> | key fragment txBytes |
| normalizedBundleFragmentOffset | <code>number</code> | normalized bundle fragment offset (default 0) |
| keyFragmentOffset | <code>number</code> | key fragment offset (default 0) |

**Returns**: <code>TxBytes</code> - Signature Fragment hbits  
<a name="module_winternitz..signatureFragments"></a>

### *winternitz*~signatureFragments(normalizeBundleFragment, keyFragment)

| Param | Type | Description |
| --- | --- | --- |
| normalizeBundleFragment | <code>TxBytes</code> | normalized bundle fragment |
| keyFragment | <code>TxBytes</code> | key fragment txBytes |

**Returns**: <code>TxBytes</code> - Signature Fragment hbits  
<a name="module_winternitz..validateSignatures"></a>

### *winternitz*~validateSignatures(expectedAddress, signatureFragments, bundleHash)

| Param | Type | Description |
| --- | --- | --- |
| expectedAddress | <code>TxBytes</code> | Expected address txs |
| signatureFragments | <code>TxBytes</code> | Array of signatureFragments txs |
| bundleHash | <code>TxHex</code> | Bundle hash txs |

<a name="module_winternitz..normalizedBundleHash"></a>

### *winternitz*~normalizedBundleHash(bundlehash)

| Param | Type | Description |
| --- | --- | --- |
| bundlehash | <code>TxBytes</code> | Bundle hash txs |

Normalizes the bundle hash, with resulting digits summing to zero.

**Returns**: <code>TxBytes</code> - Normalized bundle hash  
