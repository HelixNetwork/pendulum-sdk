import test from "ava";
import { padHBytes } from "../src";

test("padHBytes() adds padding to hbytes.", t => {
  const hbytes = "abcd";
  const expected = "abcd00";
  t.is(
    padHBytes(6)(hbytes),
    expected,
    "padHBits() should add padding to hbytes."
  );
});

test("padHBytes() returns the given string as is, if exceeds given length.", t => {
  const hbytes = "abcd";
  const expected = "abcd";

  t.is(
    padHBytes(4)(hbytes),
    expected,
    "padHBits() should return the given string as is, if exceeds given length."
  );
});
