import { transactionTxHex } from "@helixnetwork/samples";
import test from "ava";
import { isTransactionTxHex } from "../src";

test("isTransactionTxHex() returns true for valid transaction txHex.", t => {
  t.is(
    isTransactionTxHex(transactionTxHex),
    true,
    "isTransactionTxHex() should return true for valid transaction txHex."
  );
});

test("isTransactionTxHex() returns false if provided txHex are invalid and minWeightMagnitude <= weightMagnitude.", t => {
  t.is(
    isTransactionTxHex(transactionTxHex.slice(4), 2),
    false,
    "isTransactionTxHex() returns false if provided txHex are invalid and minWeightMagnitude <= weightMagnitude."
  );
});

test("isTransactionTxHex() returns false if provided txHex are valid and minWeightMagnitude > weightMagnitude.", t => {
  t.is(
    isTransactionTxHex(transactionTxHex, 5),
    false,
    "isTransactionTxHex() returns false if provided txHex are valid and minWeightMagnitude > weightMagnitude."
  );
});

test("isTransactionTxHex() returns false for invalid transaction txHex.", t => {
  const invalidLength = transactionTxHex.slice(6);
  const invalidTxHex = `us${transactionTxHex.slice(2)}`;

  t.is(
    isTransactionTxHex(invalidLength),
    false,
    "isTransactionTxHex() should return false for transaction txHex of invalid length."
  );

  t.is(
    isTransactionTxHex(invalidTxHex),
    false,
    "isTransactionTxHex() should return false for invalid txHex."
  );
});
