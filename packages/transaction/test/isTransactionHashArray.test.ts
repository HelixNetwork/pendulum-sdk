import test from "ava";
import { isTransactionHashArray } from "../src";

test("isTransactionHashArray() returns true for valid transaction hashes.", t => {
  const hashes = [
    "abcdef123454223423423abcdabcdef123454223423423abcdabcdef12345422"
  ];
  t.is(
    isTransactionHashArray(hashes),
    true,
    "isTransactionHashArray() should return true for valid transaction hashes."
  );
});

test("isTransactionHash() returns false for invalid transaction hashes.", t => {
  const invalidLength = [
    "abcdef123454223423423abcdabcdef123454223423423abcdabcdef1234542278878"
  ];
  const invalidHBytes = [
    "abcdef123454223423423abcdabcdef12345422342342bcdabcdef12345422bn"
  ];

  t.is(
    isTransactionHashArray(invalidLength),
    false,
    "isTransactionHashArray() should return false for input of invalid length."
  );

  t.is(
    isTransactionHashArray(invalidHBytes),
    false,
    "isTransactionHashArray() should return fasle for invalid txHex."
  );
});
