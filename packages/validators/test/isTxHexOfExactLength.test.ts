import test from "ava";
import { isTxHexOfExactLength } from "../src";

test("isTxHex() returns true for valid bytes of exact length.", t => {
  const validTxHex =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee";

  t.is(
    isTxHexOfExactLength(validTxHex, 64),
    true,
    "isTxHex() should return true for valid bytes of exact length."
  );
});

test("isTxHex() returns false for bytes of invalid length.", t => {
  const bytes = "abcde123123";

  t.is(
    isTxHexOfExactLength(bytes, 12),
    false,
    "isTxHex() should return false for bytes of invalid length."
  );
});

test("isTxHex() returns false for invalid bytes.", t => {
  const invalidTxHex = "aBcd111111";

  t.is(
    isTxHexOfExactLength(invalidTxHex, 10),
    false,
    "isTxHex() should return false for invalid bytes."
  );
});
