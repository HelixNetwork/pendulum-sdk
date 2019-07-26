import {
  attachedTransactionObjects,
  bundle,
  bundleHBytes,
  bundleWithZeroValue,
  bundleWithZeroValueHBytes,
  transactionTxHex as txHex,
  transactionObject
} from "@helixnetwork/samples";
import test from "ava";
import {
  asFinalTransactionHBytes,
  asTransactionHBytes,
  transactionTxHex
} from "../src";

test("asTransactionHBytes() converts transaction object to transaction txHex.", t => {
  t.deepEqual(
    asTransactionHBytes(transactionObject),
    txHex,
    "asTransactionHBytes() should convert transaction object to transaction txHex."
  );
});

test("asTransactionHBytes() converts transaction object array to transaction txHex array.", t => {
  t.deepEqual(
    asTransactionHBytes([transactionObject]),
    [txHex],
    "asTransactionHBytes() should convert transaction object array to transaction txHex array."
  );
});

test("transactionTxHex() converts transaction object to transaction txHex.", t => {
  t.deepEqual(
    transactionTxHex(transactionObject),
    txHex,
    "transactionTxHex() should convert transaction object to transaction txHex."
  );
});

test("asFinalTransactionHBytes() converts transaction objects to reversed txHex.", t => {
  t.deepEqual(
    asFinalTransactionHBytes([...bundle]),
    [...bundleHBytes].reverse(),
    "asFinalTransactionHBytes() should convert transaction objects to reversed txHex."
  );
});
