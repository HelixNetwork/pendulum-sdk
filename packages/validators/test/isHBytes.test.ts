import test from "ava";
import { isHBytes } from "../src";

test("isHBytes() returns true for valid hbytes.", t => {
  const validHBytes =
    "JALLWDUOSTSJVL9EEHKW9YQFPBVBJAGLNKRVGSQZCGHQWEMIIILJMTHVAGVDXJVZMBAMOZTSBQNRVNLLS";

  t.is(
    isHBytes(validHBytes),
    true,
    "isHBytes() should return true for valid hbytes."
  );
});

test("isHBytes() returns true for valid hbytes and length.", t => {
  const hbytes = "ABCDEFGHI";

  t.is(
    isHBytes(hbytes, 9),
    true,
    "isHBytes() should return true for valid hbytes and valid length."
  );
});

test("isHBytes() returns false for hbytes of invalid length.", t => {
  const hbytes = "ABCDEFGHI";

  t.is(
    isHBytes(hbytes, 10),
    false,
    "isHBytes() should return false for hbytes of invalid length."
  );
});

test("isHBytes() returns false for invalid hbytes.", t => {
  const invalidHBytes =
    "134asdfLWDUOSTSJVL9EEHKW9YQFPBVBJAGLNKRVGSQZCGHQWEMIIILJMTHVAGVDXJVZMBAMOZTSBQNRVNLLASD";

  t.is(
    isHBytes(invalidHBytes),
    false,
    "isHBytes() should return false for invalid hbytes."
  );
});
