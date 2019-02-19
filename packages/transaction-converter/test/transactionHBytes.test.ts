import {
  attachedTransactionObjects,
  bundle,
  bundleHBytes,
  bundleWithZeroValue,
  transactionHBytes as hbytes,
  transactionObject
} from "@helixnetwork/samples";
import test from "ava";
import {
  asFinalTransactionHBytes,
  asTransactionHBytes,
  transactionHBytes
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

test("transactionHBytes() converts transaction object to transaction hbytes.", t => {
  t.deepEqual(
    transactionHBytes(transactionObject),
    hbytes,
    "transactionHBytes() should convert transaction object to transaction hbytes."
  );
});

test("asFinalTransactionHBytes() converts transaction objects to reversed hbytes.", t => {
  t.deepEqual(
    asFinalTransactionHBytes([...bundle]),
    [...bundleHBytes].reverse(),
    "asFinalTransactionHBytes() should convert transaction objects to reversed hbytes."
  );
});
