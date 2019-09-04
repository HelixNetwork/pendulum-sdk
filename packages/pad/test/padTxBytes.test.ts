import test from "ava";
import { padTxHex } from "../src";

test("padTxHex() adds padding to txs.", t => {
  const txs = "abcd";
  const expected = "abcd00";
  t.is(padTxHex(6)(txs), expected, "padTxBits() should add padding to txs.");
});

test("padTxHex() returns the given string as is, if exceeds given length.", t => {
  const txs = "abcd";
  const expected = "abcd";

  t.is(
    padTxHex(4)(txs),
    expected,
    "padTxBits() should return the given string as is, if exceeds given length."
  );
});
