import test from "ava";
import {
  bundle,
  bundleHBytes,
  bundleWithZeroValue,
  transactionObject,
  transactionHBytes as hbytes,
  attachedTransactionObjects
} from "@helix/samples";
import {
  asFinalTransactionHBytes,
  asTransactionHBytes,
  transactionHBytes
} from "../src";

test("asTransactionHBytes() converts transaction object to transaction hbytes.", t => {
  console.log("bundleWithZeroValue");
  console.log(transactionHBytes(bundleWithZeroValue[0]));
  console.log("bundle0");
  console.log(transactionHBytes(bundle[0]));
  console.log("bundle1:");
  console.log(asTransactionHBytes(bundle[1]));
  console.log("bundle2:");
  console.log(asTransactionHBytes(bundle[2]));
  console.log("bundle3:");
  console.log(asTransactionHBytes(bundle[3]));

  console.log("attachedTransactionObjects0:");
  console.log(asTransactionHBytes(attachedTransactionObjects[0]));
  console.log("attachedTransactionObjects1:");
  console.log(asTransactionHBytes(attachedTransactionObjects[1]));

  console.log("transactionObject:");
  console.log(asTransactionHBytes(transactionObject));

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
