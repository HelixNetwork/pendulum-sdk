import test from "ava";
import { isHBytesOfMaxLength } from "../src";

test("isHBytesOfMaxLength() returns true for valid hbytes and length.", t => {
  const validHBytes =
    "JALLWDUOSTSJVL9EEHKW9YQFPBVBJAGLNKRVGSQZCGHQWEMIIILJMTHVAGVDXJVZMBAMOZTSBQNRVNLLS";

  t.is(
    isHBytesOfMaxLength(validHBytes, 81),
    true,
    "isHBytesOfMaxLength() should return true for valid hbytes and length."
  );

  t.is(
    isHBytesOfMaxLength("DASFASDF", 81),
    true,
    "isHBytesOfMaxLength() should return true for valid hbytes and length."
  );
});

test("isHBytesOfMaxLength() returns false for hbytes of invalid length.", t => {
  const hbytes = "ABCDEFGHI";

  t.is(
    isHBytesOfMaxLength(hbytes, 8),
    false,
    "isHBytesOfMaxLength() should return false for hbytes of invalid length."
  );
});

test("isHBytesOfMaxLength() returns false for invalid hbytes.", t => {
  const invalidHBytes =
    "134asdfLWDUOSTSJVL9EEHKW9YQFPBVBJAGLNKRVGSQZCGHQWEMIIILJMTHVAGVDXJVZMBAMOZTSBQNRVNLLASD";

  t.is(
    isHBytesOfMaxLength(invalidHBytes, 87),
    false,
    "isHBytesOfMaxLength() should return false for invalid hbytes."
  );
});
