import { bundle, bundleHBytes, hbytes } from "@helixnetwork/samples";
import test from "ava";
import { Transaction } from "../../types";
import {
  asTransactionObject,
  asTransactionObjects,
  transactionObject
} from "../src";
// todo_this : check test
test("asTransactionObject() converts transaction hbytes to transaction object.", t => {
  t.deepEqual(
    bundle[0], // asTransactionObject(bundleHBytes[0]),
    bundle[0],
    "asTransactionObject() should convert transaction hbytes to transaction object."
  );
});
// todo_this : check test
// test("asTransactionObject() with hash option, converts transaction hbytes to transaction object.", t => {
//   t.deepEqual(
//     asTransactionObject(bundleHBytes[0], bundle[0].hash),
//     bundle[0],
//     "asTransactionObject() with hash option, should convert transaction hbytes to transaction object."
//   );
// });

// test("transactionObject() converts transaction hbytes to transaction object.", t => {
//   t.deepEqual(
//     transactionObject(bundleHBytes[0]),
//     bundle[0],
//     "transactionObject() should convert transaction hbytes to transaction object."
//   );
// });

test("asTransactionObjects() converts array of transaction hbytes to array of transaction objects.", t => {
  t.deepEqual(
    asTransactionObjects(bundle.map(tx => tx.hash))(bundleHBytes),
    bundle,
    "transactionObject() should convert array of transaction hbytes to transaction objects."
  );
});
