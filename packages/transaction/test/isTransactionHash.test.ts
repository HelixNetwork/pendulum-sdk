import { transactionObject } from "@helixnetwork/samples";
import test from "ava";
import { isTransactionHash } from "../src";

test("isTransactionHash() returns true for valid transaction hash.", t => {
  const hash =
    "70f2c3607c71c6c80300a25b68fe247a2b154e8507f580d21da7f23212f574bd";
  t.is(
    isTransactionHash(hash),
    true,
    "isTransactionHash() should return true for valid transaction hash."
  );
});

test("isTransactionHash() returns true if provided hash is valid and minWeightMagnitude <= weightMagnitude.", t => {
  t.is(
    isTransactionHash(transactionObject.hash, 2),
    true,
    "isTransactionHash() returns true if provided hash is valid and minWeightMagnitude <= weightMagnitude."
  );
});

test("isTransactionHash() returns false if provided hash is invalid and minWeightMagnitude <= weightMagnitude.", t => {
  t.is(
    isTransactionHash(transactionObject.hash.slice(1), 3),
    false,
    "isTransactionHash() returns false if provided hash is invalid and minWeightMagnitude <= weightMagnitude."
  );
});

test("isTransactionHash() returns false if provided hash is valid and minWeightMagnitude > weightMagnitude.", t => {
  t.is(
    isTransactionHash(transactionObject.hash, 5),
    false,
    "isTransactionHash() returns false if provided hash is valid and minWeightMagnitude > weightMagnitude."
  );
});

test("isTransactionHash() returns false for invalid transaction hash.", t => {
  const invalidLength =
    "abcdef123454223423423abcdabcdef123454223423423abcdabcdef123454224545";
  const invalidHBytes =
    "abcdef123454223423423abcdabcdef123454223423423abcdabcdef1234542n";

  t.is(
    isTransactionHash(invalidLength),
    false,
    "isTransactionHash() should return false for input of invalid length."
  );

  t.is(
    isTransactionHash(invalidHBytes),
    false,
    "isTransactionHash() should return false for invalid hbytes."
  );
});
