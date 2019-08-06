import { transactionTxHex } from "@helixnetwork/samples";
import test from "ava";
import { isTransactionTxHex } from "../src";

test("isTransactionTxHex() returns true for valid transaction txs.", t => {
  t.is(
    isTransactionTxHex(transactionTxHex),
    true,
    "isTransactionTxHex() should return true for valid transaction txs."
  );
});

test("isTransactionTxHex() returns false if provided txs are invalid and minWeightMagnitude <= weightMagnitude.", t => {
  t.is(
    isTransactionTxHex(transactionTxHex.slice(4), 2),
    false,
    "isTransactionTxHex() returns false if provided txs are invalid and minWeightMagnitude <= weightMagnitude."
  );
});

test("isTransactionTxHex() returns false if provided txs are valid and minWeightMagnitude > weightMagnitude.", t => {
  t.is(
    isTransactionTxHex(transactionTxHex, 5),
    false,
    "isTransactionTxHex() returns false if provided txs are valid and minWeightMagnitude > weightMagnitude."
  );
});

test("isTransactionTxHex() returns false for invalid transaction txs.", t => {
  const invalidLength = transactionTxHex.slice(6);
  const invalidTxHex = `us${transactionTxHex.slice(2)}`;

  t.is(
    isTransactionTxHex(invalidLength),
    false,
    "isTransactionTxHex() should return false for transaction txs of invalid length."
  );

  t.is(
    isTransactionTxHex(invalidTxHex),
    false,
    "isTransactionTxHex() should return false for invalid txs."
  );
});
