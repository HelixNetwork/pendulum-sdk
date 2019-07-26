import {
  attachedTransactionObjects,
  bundle,
  bundleHBytes,
  bundleWithZeroValue,
  bundleWithZeroValueHBytes,
  transactionTxHex as hbytes,
  transactionObject
} from "@helixnetwork/samples";
import test from "ava";
import {
  asFinalTransactionHBytes,
  asTransactionHBytes,
  transactionTxHex
} from "../src";

test("asTransactionHBytes() converts transaction object to transaction hbytes.", t => {
  t.deepEqual(
    asTransactionHBytes(transactionObject),
    hbytes,
    "asTransactionHBytes() should convert transaction object to transaction hbytes."
  );
});

test("asTransactionHBytes() converts transaction object array to transaction hbytes array.", t => {
  t.deepEqual(
    asTransactionHBytes([transactionObject]),
    [hbytes],
    "asTransactionHBytes() should convert transaction object array to transaction hbytes array."
  );
});

test("transactionTxHex() converts transaction object to transaction hbytes.", t => {
  t.deepEqual(
    transactionTxHex(transactionObject),
    hbytes,
    "transactionTxHex() should convert transaction object to transaction hbytes."
  );
});

test("asFinalTransactionHBytes() converts transaction objects to reversed hbytes.", t => {
  t.deepEqual(
    asFinalTransactionHBytes([...bundle]),
    [...bundleHBytes].reverse(),
    "asFinalTransactionHBytes() should convert transaction objects to reversed hbytes."
  );
});
