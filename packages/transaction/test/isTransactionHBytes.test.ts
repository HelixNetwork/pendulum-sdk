import { transactionTxHex, transactionObject } from "@helixnetwork/samples";
import test from "ava";
import { isTransactionHBytes } from "../src";

test("isTransactionHBytes() returns true for valid transaction txHex.", t => {
  t.is(
    isTransactionHBytes(transactionTxHex),
    true,
    "isTransactionHBytes() should return true for valid transaction txHex."
  );
});

test("isTransactionHBytes() returns false if provided txHex are invalid and minWeightMagnitude <= weightMagnitude.", t => {
  t.is(
    isTransactionHBytes(transactionTxHex.slice(4), 2),
    false,
    "isTransactionHBytes() returns false if provided txHex are invalid and minWeightMagnitude <= weightMagnitude."
  );
});

test("isTransactionHBytes() returns false if provided txHex are valid and minWeightMagnitude > weightMagnitude.", t => {
  t.is(
    isTransactionHBytes(transactionTxHex, 5),
    false,
    "isTransactionHBytes() returns false if provided txHex are valid and minWeightMagnitude > weightMagnitude."
  );
});

test("isTransactionHBytes() returns false for invalid transaction txHex.", t => {
  const invalidLength = transactionTxHex.slice(6);
  const invalidHBytes = `us${transactionTxHex.slice(2)}`;

  t.is(
    isTransactionHBytes(invalidLength),
    false,
    "isTransactionHBytes() should return false for transaction txHex of invalid length."
  );

  t.is(
    isTransactionHBytes(invalidHBytes),
    false,
    "isTransactionHBytes() should return false for invalid txHex."
  );
});
