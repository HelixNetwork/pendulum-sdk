# Helix API

Based on IOTA-Client Implementation ([**iota.js**](https://github.com/iotaledger/iota.js)).

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

This will install all dependencies, build and link the packages together. helix.api uses [Lerna](https://lerna.js.org) to manage multiple packages. You can re-bootstrap your setup at any point with `lerna bootstrap` command.

### Run the tests

Make your changes on a single or across multiple packages and test the system in integration. Run from the _root directory_:

```
npm run test
```

To run tests of specific package just `cd` to the package directory and run `npm test` from there.

You may also want to configure your editor to build the source upon save and watch the tests running.
Once building on save is setup, you can start watching tests with `npm test --watch` from each package directory.

### Generate docs

Please update the documentation when needed by editing [`JSDoc`](http://usejsdoc.org) annotations and running `npm run docs` from the _root directory_.

## Using the API

### Installation

Install using [npm](https://www.npmjs.org/):
> @helixnetwork scope

```
npm i @helixnetwork/core
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
prepared hbytes to [`sendHBytes`](packages/core#module_core.sendHBytes) command.

```js
// must be truly random
const seed = ' your seed here '

// Array of transfers which defines transfer recipients and value transferred in helixs.
const transfers = [{
    address: ' recipient address here ',
    value: 1000, // 1Kh
    tag: '', // optional tag in hexString
    message: '' // optional message in hexString
}]

// Depth or how far to go for tip selection entry point
const depth = 3

// Difficulty of Proof-of-Work required to attach transaction to tangle.
// Minimum value on testnet is currently 2.
const minWeightMagnitude = 2

helix.prepareTransfers(seed, transfers)
    .then(hbytes => helix.sendHBytes(hbytes, depth, minWeightMagnitude))
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

## Next

- remove `hbits` notation, only `hbytes` are relevant for processing/storing. To avoid confusion we should introduce an additional `hString` variable.
- Value Transfers: Change Address / wereAddressesSpentFrom and validity/consistency checks on server side.
- check traverseBundle.test
- fix getNewAddress.test
- fix replayBundle.test
- fix sendBytes.test
- check wereAddressesSpentFrom.test
- check getTransfers.test
- fix getNewAddress.test
- check prepareTransfers.test
- adapt packages/samples
- Add schnorr package
- Add rsa package
- Add ipfs package
