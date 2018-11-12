import test from "ava";
import { padHBytes } from "../src";

test("padHBytes() adds padding to hbytes.", t => {
  const hbytes = "IOTA";
  const expected = "IOTA99";
  t.is(
    padHBytes(6)(hbytes),
    expected,
    "padTrits() should add padding to hbytes."
  );
});

test("padHBytes() returns the given string as is, if exceeds given length.", t => {
  const hbytes = "IOTA";
  const expected = "IOTA";

  t.is(
    padHBytes(4)(hbytes),
    expected,
    "padTrits() should return the given string as is, if exceeds given length."
  );
});
