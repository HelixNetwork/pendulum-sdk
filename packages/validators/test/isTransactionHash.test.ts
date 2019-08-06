import test from "ava";
import { isTransactionHash } from "../src";

test("isTransactionHash() returns true for valid transaction hash.", t => {
  const hash =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee";
  t.is(
    isTransactionHash(hash),
    true,
    "isTransactionHash() should return true for valid transaction hash."
  );
});

test("isTransactionHash() returns false for invalid transaction hash.", t => {
  const invalidLength =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee233232";
  const invalidTrytes =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523AV";

  t.is(
    isTransactionHash(invalidLength),
    false,
    "isTransactionHash() should return false for input of invalid length."
  );

  t.is(
    isTransactionHash(invalidTrytes),
    false,
    "isTransactionHash() should return false for invalid txs."
  );
});
