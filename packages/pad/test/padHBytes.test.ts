import test from "ava";
import { padHBytes } from "../src";

test("padHBytes() adds padding to txHex.", t => {
  const txHex = "abcd";
  const expected = "abcd00";
  t.is(
    padHBytes(6)(txHex),
    expected,
    "padHBits() should add padding to txHex."
  );
});

test("padHBytes() returns the given string as is, if exceeds given length.", t => {
  const txHex = "abcd";
  const expected = "abcd";

  t.is(
    padHBytes(4)(txHex),
    expected,
    "padHBits() should return the given string as is, if exceeds given length."
  );
});
