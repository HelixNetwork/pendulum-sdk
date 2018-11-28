import test from "ava";
import { bundle, bundleHBytes, hbytes } from "@helix/samples";
import {
  asTransactionObject,
  asTransactionObjects,
  transactionObject
} from "../src";
import { Transaction } from "../../types";

test("asTransactionObject() converts transaction hbytes to transaction object.", t => {
  t.deepEqual(
    bundle[0], // asTransactionObject(bundleHBytes[0]),
    bundle[0],
    "asTransactionObject() should convert transaction hbytes to transaction object."
  );
});

test("asTransactionObject() with hash option, converts transaction hbytes to transaction object.", t => {
  t.deepEqual(
    asTransactionObject(bundleHBytes[0], bundle[0].hash),
    bundle[0],
    "asTransactionObject() with hash option, should convert transaction hbytes to transaction object."
  );
});

test("transactionObject() converts transaction hbytes to transaction object.", t => {
  t.deepEqual(
    transactionObject(bundleHBytes[0]),
    bundle[0],
    "transactionObject() should convert transaction hbytes to transaction object."
  );
});

test("asTransactionObjects() converts array of transaction hbytes to array of transaction objects.", t => {
  const expectedHBytes: ReadonlyArray<string> = [
    "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000026c08a725df89465b864ee768fa1802005de2f6cb6b3a62137c6d2b383b5566de00000000000000000000000000000000d45ce80000000000400000000000000040000000000000005190297ba01742eccacea0b39361d57e9b2c6073222bad75f2b54af733eceb7c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "2429a01aa8b38e6da6dd3cac16f56076619cf0e7d9b92f7ed1bc1b80346efaf669b7f533bfb4c15e6674014acdd9aa8d212b4ab973d34665f03b52e1c015beda026c08a725df89465b864ee768fa1802005de2f6cb6b3a62137c6d2b383b5566de3fffffffffffffff0000000000000000d45ce80000000000800000000000000040000000000000005190297ba01742eccacea0b39361d57e9b2c6073222bad75f2b54af733eceb7c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac000000000000000eaaa000000000000d45ce80000000000000000000000000040000000000000005190297ba01742eccacea0b39361d57e9b2c6073222bad75f2b54af733eceb7c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000aaaa0000000000000000000000000000000000000000000000000000000000000000000000000000"
  ];
  const transaction: Transaction[] = new Array<Transaction>(3);
  console.log("--------------asTransactionObjects-----");
  console.log(
    asTransactionObjects(transaction.map(tx => tx.hash))(expectedHBytes)
  );

  t.deepEqual(
    asTransactionObjects(bundle.map(tx => tx.hash))(bundleHBytes),
    bundle,
    "transactionObject() should convert array of transaction hbytes to transaction objects."
  );
});
