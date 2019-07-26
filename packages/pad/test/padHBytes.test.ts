import test from "ava";
import { padTxHex } from "../src";

test("padTxHex() adds padding to txHex.", t => {
  const txHex = "abcd";
  const expected = "abcd00";
  t.is(padTxHex(6)(txHex), expected, "padHBits() should add padding to txHex.");
});

test("padTxHex() returns the given string as is, if exceeds given length.", t => {
  const txHex = "abcd";
  const expected = "abcd";

  t.is(
    padTxHex(4)(txHex),
    expected,
    "padHBits() should return the given string as is, if exceeds given length."
  );
});
