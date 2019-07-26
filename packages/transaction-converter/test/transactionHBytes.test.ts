import {
  attachedTransactionObjects,
  bundle,
  bundleHBytes,
  bundleWithZeroValue,
  bundleWithZeroValueTxHex,
  transactionTxHex as txHex,
  transactionObject
} from "@helixnetwork/samples";
import test from "ava";
import {
  asFinalTransactionStrings,
  asTransactionStrings,
  transactionTxHex
} from "../src";

test("asTransactionStrings() converts transaction object to transaction txHex.", t => {
  t.deepEqual(
    asTransactionStrings(transactionObject),
    txHex,
    "asTransactionStrings() should convert transaction object to transaction txHex."
  );
});

test("asTransactionStrings() converts transaction object array to transaction txHex array.", t => {
  t.deepEqual(
    asTransactionStrings([transactionObject]),
    [txHex],
    "asTransactionStrings() should convert transaction object array to transaction txHex array."
  );
});

test("transactionTxHex() converts transaction object to transaction txHex.", t => {
  t.deepEqual(
    transactionTxHex(transactionObject),
    txHex,
    "transactionTxHex() should convert transaction object to transaction txHex."
  );
});

test("asFinalTransactionStrings() converts transaction objects to reversed txHex.", t => {
  t.deepEqual(
    asFinalTransactionStrings([...bundle]),
    [...bundleHBytes].reverse(),
    "asFinalTransactionStrings() should convert transaction objects to reversed txHex."
  );
});
