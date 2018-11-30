import test from "ava";
import { isHashArray } from "../src";

test("isHashArray", t => {
  const hashes = [
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee",
    "def1233445234234232aaaaaccac1233445234234232adedeadea123344523ee"
  ];

  const invalidHashes = [
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee324234324",
    "BCc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee"
  ];

  t.is(
    isHashArray(hashes),
    true,
    "isHashArray() should return true for valid hashes"
  );

  t.is(
    isHashArray(invalidHashes),
    false,
    "isHashArray() should return false for invalid hashes"
  );
});
