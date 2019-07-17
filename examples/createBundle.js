// Require the Helix libraries
//import {Transaction, Transfer} from "../types";

const Helix = require("@helixnetwork/core");
const Converter = require("@helixnetwork/converter");
const TransactionConverter = require("@helixnetwork/transaction-converter");
const Transaction = require("@helixnetwork/transaction");

// Create a new instance of the Helix object
// Use the provider field to specify which node to connect to
const helix = Helix.composeAPI({
  provider: "https://hlxtest.net:8087"
});

// Sender
const senderSeed = "abcd";

var inputs = [
  {
    address: "1245e733c1abf577cff3056880f9963ae6170e4bd02c53dcea9db9501e8d52e1",
    keyIndex: 0,
    security: 2,
    balance: 4
  },
  {
    address: "df485155f326d19468056861b677277d48bfbda340bdc05c5c81333e9fc04d8c",
    keyIndex: 1,
    security: 2,
    balance: 4
  }
];
const remainderAddress =
  "43ad30058f25d524ab6d86e6a7290fab67c1d70aeea10d55f1b7908f30547a13";
const transfers = [
  {
    address: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    value: 3,
    tag: Converter.asciiToHBytes("aaaa"),
    message: Converter.asciiToHBytes("abcd")
  }
];

var storedHBytes;

// Create bundle and return the HBytes of the prepared TXs
helix
  .prepareTransfers(senderSeed, transfers, {
    inputs,
    remainderAddress
  })
  .then(hbytes => {
    console.log(
      "export const bundleHBytes: HBytes[] = " +
        JSON.stringify([hbytes].reverse()) +
        ";"
    );
    console.log("export const bundle: Transaction[] = ");
    console.log(
      TransactionConverter.asTransactionObjects(Array(5).map(tx => tx.hash))(
        hbytes
      ).reverse()
    );
    storedHBytes = hbytes;
    console.log("-------------------- call sendHBytes ------------------");
    // Finalize and broadcast the bundle to the node
    return helix.sendHBytes(
      storedHBytes,
      5 /*depth*/,
      2 /*minimum weight magnitude*/
    );
  })
  .then(results => {
    console.log("--------------------response from tangle ------------------");

    console.log("export const bundle: Transaction[] = ");
    console.log(results);

    console.log("export const bundleHBytes: HBytes[] = ");
    const hbytesResult = TransactionConverter.asTransactionHBytes(results);
    console.log(hbytesResult);

    const bundleFromTangle = Array.from(results);
    const transactions = Array.from(hbytesResult);
    for (var i = 0; i < transactions.length; i++) {
      console.log("Transaction " + i);
      console.log(
        "Transaction hash from tangle: " + bundleFromTangle[i]["hash"]
      );
      let computedTransactionHash = Transaction.transactionHash(
        transactions[i]
      );
      console.log(
        "New computed hash (in helix.lib): " + computedTransactionHash
      );
      console.log(
        "Equal hashes? " + bundleFromTangle[i]["hash"] ==
          computedTransactionHash
      );
    }
  })
  .catch(err => {
    console.log(err);
  });
