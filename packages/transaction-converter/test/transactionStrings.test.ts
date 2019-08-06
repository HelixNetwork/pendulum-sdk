import {
  bundle,
  bundleTxHex,
  transactionObject,
  transactionTxHex as txs
} from "@helixnetwork/samples";
import test from "ava";
import {
  asFinalTransactionStrings,
  asTransactionStrings,
  transactionTxHex
} from "../src";

test("asTransactionStrings() converts transaction object to transaction txs.", t => {
  t.deepEqual(
    asTransactionStrings(transactionObject),
    txs,
    "asTransactionStrings() should convert transaction object to transaction txs."
  );
});

test("asTransactionStrings() converts transaction object array to transaction txs array.", t => {
  t.deepEqual(
    asTransactionStrings([transactionObject]),
    [txs],
    "asTransactionStrings() should convert transaction object array to transaction txs array."
  );
});

test("transactionTxHex() converts transaction object to transaction txs.", t => {
  t.deepEqual(
    transactionTxHex(transactionObject),
    txs,
    "transactionTxHex() should convert transaction object to transaction txs."
  );
});

test("asFinalTransactionStrings() converts transaction objects to reversed txs.", t => {
  t.deepEqual(
    asFinalTransactionStrings([...bundle]),
    [...bundleTxHex].reverse(),
    "asFinalTransactionStrings() should convert transaction objects to reversed txs."
  );
});
