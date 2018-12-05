import test from "ava";
import { transactionHBytes, transactionObject } from "@helixnetwork/samples";
import { isTransactionHBytes } from "../src";

test("isTransactionHBytes() returns true for valid transaction hbytes.", t => {
  t.is(
    isTransactionHBytes(transactionHBytes),
    true,
    "isTransactionHBytes() should return true for valid transaction hbytes."
  );
});

// todo test: recheck this test
// test("isTransactionHBytes() returns true if provided hbytes are valid and minWeightMagnitude <= weightMagnitude.", t => {
//   t.is(
//     isTransactionHBytes(transactionHBytes, 2),
//     true,
//     "isTransactionHBytes() returns true if provided hbytes are valid and minWeightMagnitude <= weightMagnitude."
//   );
// });

test("isTransactionHBytes() returns false if provided hbytes are invalid and minWeightMagnitude <= weightMagnitude.", t => {
  t.is(
    isTransactionHBytes(transactionHBytes.slice(4), 2),
    false,
    "isTransactionHBytes() returns false if provided hbytes are invalid and minWeightMagnitude <= weightMagnitude."
  );
});
// todo_this : check test
// test("isTransactionHBytes() returns false if provided hbytes are valid and minWeightMagnitude > weightMagnitude.", t => {
//   t.is(
//     isTransactionHBytes(transactionHBytes, 5),
//     false,
//     "isTransactionHBytes() returns false if provided hbytes are valid and minWeightMagnitude > weightMagnitude."
//   );
// });

test("isTransactionHBytes() returns false for invalid transaction hbytes.", t => {
  const invalidLength = transactionHBytes.slice(6);
  const invalidHBytes = `us${transactionHBytes.slice(2)}`;

  t.is(
    isTransactionHBytes(invalidLength),
    false,
    "isTransactionHBytes() should return false for transaction hbytes of invalid length."
  );

  t.is(
    isTransactionHBytes(invalidHBytes),
    false,
    "isTransactionHBytes() should return false for invalid hbytes."
  );
});
