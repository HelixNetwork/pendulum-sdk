# Helix API

Based on IOTA-Client Reference Implementation in Javascript
> DISCLAIMER: This readme and most of the code base are taken from the IOTA Foundation. This repository is NOT intended for public use and is subject to the agreed Non-Disclosure-Agreement.  As it was a spontaneous decision to fork from the newer typescript implementation, this repository is just freshly refactored, expect wrong naming and minor mistakes.  On a different note, the Helix signature scheme, which was already implemented in javascript, is now being translated to typescript, so expect some pushes to this repository from our side.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/helixnetwork/helix.ap/master/LICENSE)  

---

## Contributing

Thanks for everyone involved in the process of developing the Official Helix API. Hat tip to all of the IOTA developers that have enabled this great technology.

### Clone and bootstrap

1. Fork the repo with <kbd>Fork</kbd> button at top right corner.
2. Clone your fork locally and `cd` in it.
3. Bootstrap your environment with:

```
npm run init
```

This will install all dependencies, build and link the packages together. helix.js uses [Lerna](https://lernajs.io/) to manage multiple packages. You can re-bootstrap your setup at any point with `lerna bootstrap` command.

### Run the tests

Make your changes on a single or across multiple packages and test the system in integration. Run from the _root directory_:

```
npm test
```

To run tests of specific package just `cd` to the package directory and run `npm test` from there.

You may also want to configure your editor to build the source uppon save and watch the tests running.
Once building on save is setup, you can start watching tests with `npm test --watch` from each package directory.

### Generate docs

Please update the documentation when needed by editing [`JSDoc`](http://usejsdoc.org) annotations and running `npm run docs` from the _root directory_.

## Using the API

### Installation

Install using [npm](https://www.npmjs.org/):
> @helix scope

```
npm h @helix/core
```

### Connecting to network

```js
import { composeAPI } from '@helixnetwork/core'

const helix = composeAPI({
    provider: 'http://localhost:14700'
})

helix.getNodeInfo()
    .then(info => console.log(info))
    .catch(err => {})
```

Composing custom client methods with network provider:

1. Install an Helix.Protocol http client:

```
npm install @helixnetwork/http-client
```

2. Create an api method with custom provider:
```js
import { createHttpClient } from '@helixnetwork/http-client'
import { createGetNodeInfo } from '@helixnetwork/core'

const client = createHttpClient({
    provider: 'http://localhost:14265'
})

const getNodeInfo = createGetNodeInfo(client)
```

### Creating &amp; broadcasting transactions

Publish transfers by calling [`prepareTransfers`](packages/core#module_core.prepareTransfers) and piping the
prepared trytes to [`sendTrytes`](packages/core#module_core.sendTrytes) command.

```js
// must be truly random & 81-trytes long
const seed = ' your seed here '

// Array of transfers which defines transfer recipients and value transferred in helixs.
const transfers = [{
    address: ' recipient address here ',
    value: 1000, // 1Ki
    tag: '', // optional tag of `0-27` trytes
    message: '' // optional message in trytes
}]

// Depth or how far to go for tip selection entry point
const depth = 3

// Difficulty of Proof-of-Work required to attach transaction to tangle.
// Minimum value on mainnet & spamnet is `14`, `9` on devnet and other testnets.
const minWeightMagnitude = 14

helix.prepareTransfers(seed, transfers)
    .then(trytes => helix.sendTrytes(trytes, depth, minWeightMagnitude))
    .then(bundle => {
        console.log(`Published transaction with tail hash: ${bundle[0].hash}`)
        console.log(`Bundle: ${bundle}`)
    })
    .catch(err => {
        // catch any errors
    })
```

## Documentation

For details on all available API methods please see the [reference page](api_reference.md).

Documentation of helix protocol and [`Helix.Protocol`](https://hlx.readme.io/hcp) http API can be found on [Helix Internal Documentation](https://hlx.readme.io).
