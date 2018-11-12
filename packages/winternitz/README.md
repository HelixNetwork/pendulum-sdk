# @helix/winternitz

Winternitz OTS Implementation (binary)

> Helix Signing Implementation .ts implementation in tests and maintenance currently.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @helix/winternitz
```

## Normalization & Security
- no need for normalization, because bytes in the bundle hash can be used as they are
- iota always need 27 trytes message for signing (because they have 27 key chunks)
- a bundle hash has 81 trytes, so for signing it always has to be splitted in 3 parts
- in the case of a valued transacttion there is always a need of 3 signature fragments (= 3 transactions)
- The number of security levels also has an influence on the size of the bundle, ie the number of signature fragments / transactions
- our bundle hash has a size of 32 bytes and we need a 32 bytes message for signing
- method 1: 2 security levels, 16 bytes message, 16 key chunks
- method 2: take a different amount of bits for signing
- e are now using 8 bits/ 1 byte for each key chunk (security 2)
- we could use 4 bits (-> 16 ROUNDS) for each key chunk (security 1)
## Security Levels
- Either `1`: 32**B**, `2`: 64**B**, `3`: 96**B**
- or `1`: 32**B**, `2`: 64**B**, `3`: 128**B**

## Generating an Address
