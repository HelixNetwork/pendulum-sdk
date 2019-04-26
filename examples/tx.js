// Require the Helix libraries
const Helix = require("@helixnetwork/core");
const Converter = require("@helixnetwork/converter");

// Create a new instance of the Helix object
// Use the provider field to specify which node to connect to
const helix = Helix.composeAPI({
  provider: "http://localhost:14700"
});

const seed = "df36d3a5c687106be8c8880ce06117a302bd09fe88355cd4102b901ad9f76ec2";

var recipientAddress1 =
  "064c7c7652a56055c3af2c620ee3a9daf4be3ad6cebaa8d5dd9ed8a8d7509ea1";

var recipientAddress2 =
  "cf36dc1226a7e275641a2486a2aa2bf44347dac544d24079231597ee25b2cb9f";

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
  value: 536561674354688,
  message: Converter.asciiToHBytes("abcd"),
  tag: "abcd123"
};

// Create bundle and return the HBytes of the prepared TXs
helix
  .prepareTransfers(seed, [transfer2])
  .then(function(HBytes) {
    storedHBytes = HBytes;
    // Finalize and broadcast the bundle to the node
    return helix.sendHBytes(
      storedHBytes,
      3 /*depth*/,
      2 /*minimum weight magnitude*/
    );
  })

  .then(results => console.log(JSON.stringify(results)))
  .catch(err => {
    console.log(err);
  });
