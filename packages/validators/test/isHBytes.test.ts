import test from "ava";
import { isTxHex } from "../src";

test("isHByte() returns true for valid bytes string in hex.", t => {
  const validTxHex =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee";

  t.is(
    isTxHex(validTxHex),
    true,
    "isTxHex() should return true for valid bytes."
  );
});

test("isHByte() returns true for valid bytes and length.", t => {
  const bytes = "abcdef12";

  t.is(
    isTxHex(bytes, 8),
    true,
    "isTxHex() should return true for valid bytes and valid length."
  );
});

test("isTxHex() returns false for bytes of invalid length.", t => {
  const bytes = "abcdef123";
  t.is(
    isTxHex(bytes, 10),
    false,
    "isTxHex() should return false for bytes of invalid length."
  );
});

test("isTxHex() returns false for invalid bytes.", t => {
  const invalidTxHex =
    "ghbnabc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee";

  t.is(
    isTxHex(invalidTxHex),
    false,
    "isTxHex() should return false for invalid bytes."
  );
});
