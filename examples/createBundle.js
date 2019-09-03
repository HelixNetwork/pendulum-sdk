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
    tag: Converter.asciiToTxBytes("aaaa"),
    message: Converter.asciiToTxBytes("abcd")
  }
];

var storedTxBytes;

// Create bundle and return the TxBytes of the prepared TXs
helix
  .prepareTransfers(senderSeed, transfers, {
    inputs,
    remainderAddress
  })
  .then(txs => {
    console.log(
      "export const bundleTxBytes: TxBytes[] = " +
        JSON.stringify([txs].reverse()) +
        ";"
    );
    console.log("export const bundle: Transaction[] = ");
    console.log(
      TransactionConverter.asTransactionObjects(Array(5).map(tx => tx.hash))(
        txs
      ).reverse()
    );
    storedTxBytes = txs;
    console.log(
      "-------------------- call sendTransactionStrings ------------------"
    );
    // Finalize and broadcast the bundle to the node
    return helix.sendTransactionStrings(
      storedTxBytes,
      5 /*depth*/,
      2 /*minimum weight magnitude*/
    );
  })
  .then(results => {
    console.log("--------------------response from tangle ------------------");

    console.log("export const bundle: Transaction[] = ");
    console.log(results);

    console.log("export const bundleTxBytes: TxBytes[] = ");
    const txssResult = TransactionConverter.asTransactionTxBytes(results);
    console.log(txssResult);

    const bundleFromTangle = Array.from(results);
    const transactions = Array.from(txssResult);
    for (var i = 0; i < transactions.length; i++) {
      console.log("Transaction " + i);
      console.log(
        "Transaction hash from tangle: " + bundleFromTangle.slice(i, i + 1).hash
      );
      let computedTransactionHash = Transaction.transactionHash(
        Converter.toTxBytes(transactions.slice(i, i + 1))
      );
      console.log(
        "New computed hash (in helix.lib): " + computedTransactionHash
      );
      console.log(
        "Equal hashes? " +
          (bundleFromTangle.slice(i, i + 1).hash === computedTransactionHash)
      );
    }
  })
  .catch(err => {
    console.log(err);
  });
