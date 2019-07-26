import test from "ava";
import { isTxHexOfMaxLength } from "../src";

test("isTxHexOfMaxLength() returns true for valid bytes and length.", t => {
  const validTxHex =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523e";

  t.is(
    isTxHexOfMaxLength(validTxHex, 2 * 32), // replaced 81 bytes with 2 * 32 bytes
    true,
    "isTxHexOfMaxLength() should return true for valid bytes and length."
  );

  t.is(
    isTxHexOfMaxLength("abcdabcd", 2 * 32), // replaced 81 bytes with 2 * 32 bytes
    true,
    "isTxHexOfMaxLength() should return true for valid bytes and length."
  );
});

test("isTxHexOfMaxLength() returns false for bytes of invalid length.", t => {
  const bytes = "abcdef";

  t.is(
    isTxHexOfMaxLength(bytes, 4),
    false,
    "isTxHexOfMaxLength() should return false for bytes of invalid length."
  );
});

test("isTxHexOfMaxLength() returns false for invalid bytes.", t => {
  const invalidTxHex =
    "1234accc505a524546494757484d4d3959475342535a425542544b56554d4e474f573953535439595648574b4a4d57535639455a465356504849564e5a51504c5a45";

  t.is(
    isTxHexOfMaxLength(invalidTxHex, 2 * 32 + 4),
    false,
    "isTxHexOfMaxLength() should return false for invalid bytes."
  );
});
