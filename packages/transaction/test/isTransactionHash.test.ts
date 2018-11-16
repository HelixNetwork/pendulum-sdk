import test from "ava";
import { transactionObject } from "@helix/samples";
import { isTransactionHash } from "../src";

test("isTransactionHash() returns true for valid transaction hash.", t => {
  const hash =
    "9d401b6a8c0d611da988c7e077d347d2fd160c1dad96efe0c9f02aebdc0b7d2d";
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
