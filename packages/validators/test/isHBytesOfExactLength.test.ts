import test from "ava";
import { isHBytesOfExactLength } from "../src";

test("isHBytes() returns true for valid hbytes of exact length.", t => {
  const validHBytes =
    "JALLWDUOSTSJVL9EEHKW9YQFPBVBJAGLNKRVGSQZCGHQWEMIIILJMTHVAGVDXJVZMBAMOZTSBQNRVNLL";

  t.is(
    isHBytesOfExactLength(validHBytes, 80),
    true,
    "isHBytes() should return true for valid hbytes of exact length."
  );
});

test("isHBytes() returns false for hbytes of invalid length.", t => {
  const hbytes = "ABCDEFGHI";

  t.is(
    isHBytesOfExactLength(hbytes, 10),
    false,
    "isHBytes() should return false for hbytes of invalid length."
  );
});

test("isHBytes() returns false for invalid hbytes.", t => {
  const invalidHBytes = "ab13DEFGHI";

  t.is(
    isHBytesOfExactLength(invalidHBytes, 10),
    false,
    "isHBytes() should return false for invalid hbytes."
  );
});
