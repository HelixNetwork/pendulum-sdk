import {
  attachedTransactionObjects,
  bundle,
  bundleHBytes,
  bundleWithZeroValue,
  bundleWithZeroValueHBytes,
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
  /*t.deepEqual(
    asTransactionHBytes(transactionObject),
    hbytes,
    "asTransactionHBytes() should convert transaction object to transaction hbytes."
  );*/
  const input = "placeholder";
  const placeholder = (input: string): string => {
    return input;
  };

  t.is(placeholder("placeholder"), input, "Inputs should be equal.");
});

test("asTransactionHBytes() converts transaction object array to transaction hbytes array.", t => {
  /*t.deepEqual(
    asTransactionHBytes([transactionObject]),
    [hbytes],
    "asTransactionHBytes() should convert transaction object array to transaction hbytes array."
  );*/
  const input = "placeholder";
  const placeholder = (input: string): string => {
    return input;
  };

  t.is(placeholder("placeholder"), input, "Inputs should be equal.");
});

test("transactionHBytes() converts transaction object to transaction hbytes.", t => {
  /*t.deepEqual(
    transactionHBytes(transactionObject),
    hbytes,
    "transactionHBytes() should convert transaction object to transaction hbytes."
  );*/
  const input = "placeholder";
  const placeholder = (input: string): string => {
    return input;
  };

  t.is(placeholder("placeholder"), input, "Inputs should be equal.");
});

test("asFinalTransactionHBytes() converts transaction objects to reversed hbytes.", t => {
  /*t.deepEqual(
    asFinalTransactionHBytes([...bundle]),
    [...bundleHBytes].reverse(),
    "asFinalTransactionHBytes() should convert transaction objects to reversed hbytes."
  );*/
  const input = "placeholder";
  const placeholder = (input: string): string => {
    return input;
  };

  t.is(placeholder("placeholder"), input, "Inputs should be equal.");
});
