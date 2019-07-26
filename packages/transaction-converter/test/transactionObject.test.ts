import { bundle, bundleHBytes } from "@helixnetwork/samples";
import test from "ava";
import {
  asTransactionObject,
  asTransactionObjects,
  transactionObject
} from "../src";

test("asTransactionObject() converts transaction txHex to transaction object.", t => {
  t.deepEqual(
    asTransactionObject(bundleHBytes[0]),
    bundle[0],
    "asTransactionObject() should convert transaction txHex to transaction object."
  );
});

test("asTransactionObject() with hash option, converts transaction txHex to transaction object.", t => {
  t.deepEqual(
    asTransactionObject(bundleHBytes[0], bundle[0].hash),
    bundle[0],
    "asTransactionObject() with hash option, should convert transaction txHex to transaction object."
  );
});

test("transactionObject() converts transaction txHex to transaction object.", t => {
  t.deepEqual(
    transactionObject(bundleHBytes[0]),
    bundle[0],
    "transactionObject() should convert transaction txHex to transaction object."
  );
});

test("asTransactionObjects() converts array of transaction txHex to array of transaction objects.", t => {
  t.deepEqual(
    asTransactionObjects(bundle.map(tx => tx.hash))(bundleHBytes),
    bundle,
    "transactionObject() should convert array of transaction txHex to transaction objects."
  );
});
