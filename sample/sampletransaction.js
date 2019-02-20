// Require the Helix libraries
const Helix = require("@helixnetwork/core");
const Converter = require("@helixnetwork/converter");

// Create a new instance of the Helix object
// Use the provider field to specify which IRI node to connect to
const helix = Helix.composeAPI({
  provider: "https://helix:LW59AG75A84GSEES@hlxtest.net:14702"
});

const seed = "953c8169027a85415692cc05bd3a91f95c3be8e5c93c1d2b2e2c447b5ed082d2";

var recipientAddress1 =
  "064c7c7652a56055c3af2c620ee3a9daf4be3ad6cebaa8d5dd9ed8a8d7509ea1";

var recipientAddress2 =
  "16e092b38442a4887f510e15e58cefe024f212470df123a070c4db2f5ef4c6de";

// Store the HBytes that are returned from prepareTransfers function
var storedHBytes;

// preparing transactions
var transfer1 = {
  address: recipientAddress1,
  value: 0,
  message: Converter.asciiToHBytes("abcd"),
  tag: "abcd123"
};

var transfer2 = {
  address: recipientAddress2,
  value: 0,
  message: Converter.asciiToHBytes("abcd"),
  tag: "abcd123"
};

// Create bundle and return the HBytes of the prepared TXs
helix
  .prepareTransfers(seed, [transfer1, transfer2])
  .then(function(HBytes) {
    storedHBytes = HBytes;
    // Finalize and broadcast the bundle to the IRI node
    return helix.sendHBytes(
      storedHBytes,
      3 /*depth*/,
      2 /*minimum weight magnitude*/
    );
  })

  .then(results => console.log(JSON.stringify(JSON.stringify(results))))
  .catch(err => {
    console.log(err);
  });
