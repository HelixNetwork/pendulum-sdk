// Require the Helix libraries
const Helix = require("@helixnetwork/core");
const Converter = require("@helixnetwork/converter");

// Create a new instance of the Helix object
// Use the provider field to specify which node to connect to
const helix = Helix.composeAPI({
  provider: "http://localhost:14700"
});

// Sender
const senderSeed =
  "df36d3a5c687106be8c8880ce06117a302bd09fe88355cd4102b901ad9f76ec2";
const senderAddress =
  "556a2431d03e57e92b7d4d4d37f98332fce5427d8167e16c0a5cfbe20899d261";

// Receiver
const receiverSeed =
  "f6643fef386fb8e591dbbfde2d83e9176ecdd3af5b2699d65b8c8cb6ef721cad";
const receiverAddress1 =
  "cf36dc1226a7e275641a2486a2aa2bf44347dac544d24079231597ee25b2cb9f";
const receiverAddress2 =
  "9477ec3c08c3e79a4fdcbc2a8fda9539b320b9b25dc9bc6cfca01cded875df0e";

// Store the TxBytes that are returned from prepareTransfers function
var storedTxBytes;

var transfer = {
  address: receiverAddress1,
  value: 53,
  message: Converter.asciiToTxBytes("abcd"),
  tag: "abcd123"
};

// Create bundle and return the TxBytes of the prepared TXs
helix
  .prepareTransfers(senderSeed, [transfer])
  .then(function(TxBytes) {
    storedTxBytes = TxBytes;
    // Finalize and broadcast the bundle to the node
    return helix.sendTxBytes(
      storedTxBytes,
      5 /*depth*/,
      2 /*minimum weight magnitude*/
    );
  })
  .then(results => console.log(results))
  .catch(err => {
    console.log(err);
  });
