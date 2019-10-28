// Require the Helix libraries
const Helix = require("@helixnetwork/core");
const Converter = require("@helixnetwork/converter");

// Create a new instance of the Helix object
// Use the provider field to specify which node to connect to
const helix = Helix.composeAPI({
  provider: "https://hlxtest.net:8085"
});



// sender address
const sender =
  '0000000000000000000000000000000000000000000000000000000000000000';
// receiver address
const receiver =
  '0000000000000000000000000000000000000000000000000000000000000000';

// Store the TxBytes that are returned from prepareTransfers function
let storedTxBytes;

let transfer = {
  address: receiver,
  message: Converter.asciiToTxHex('Good morning!'),
  value: 0,
  tag: Converter.asciiToTxHex('testing')
}

// Create bundle and return the TxBytes of the prepared TXs
const depth = 3;
const minWeightMagnitude = 2;
helix
  .prepareTransfers(sender,
    [transfer],
    {security:2})
  .then((txBytes) =>
    // Finalize and broadcast the bundle to the node
    helix.sendTransactionStrings(txBytes, depth, minWeightMagnitude)
  ).then(results => console.log(results))
   .catch(err => console.log(err));
