import { bundle, bundleTxHex } from "@helixnetwork/samples";
import test from "ava";
import {
  asTransactionObject,
  asTransactionObjects,
  transactionObject
} from "../src";

test("asTransactionObject() converts transaction txs to transaction object.", t => {
  t.deepEqual(
    asTransactionObject(bundleTxHex[0]),
    bundle[0],
    "asTransactionObject() should convert transaction txs to transaction object."
  );
});

test("asTransactionObject() with hash option, converts transaction txs to transaction object.", t => {
  t.deepEqual(
    asTransactionObject(bundleTxHex[0], bundle[0].hash),
    bundle[0],
    "asTransactionObject() with hash option, should convert transaction txs to transaction object."
  );
});

test("transactionObject() converts transaction txs to transaction object.", t => {
  t.deepEqual(
    transactionObject(bundleTxHex[0]),
    bundle[0],
    "transactionObject() should convert transaction txs to transaction object."
  );
});

test("asTransactionObjects() converts array of transaction txs to array of transaction objects.", t => {
  t.deepEqual(
    asTransactionObjects(bundle.map(tx => tx.hash))(bundleTxHex),
    bundle,
    "transactionObject() should convert array of transaction txs to transaction objects."
  );
});
