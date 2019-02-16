import test from "ava";
import { padHBits, padHBytes } from "../src";

test("padHBits() adds padding to hbit array.", t => {
  const hBits = new Int8Array([-1, 0, 1]);
  const expected = new Int8Array([-1, 0, 1, 0, 0, 0]);

  t.deepEqual(
    padHBits(6)(hBits),
    expected,
    "padHBits() should add padding to hbit array."
  );
});

test("padHBits() returns the hbit array as is, if exceeds given length.", t => {
  const hBits = new Int8Array([-1, 0, 1]);
  const expected = new Int8Array([-1, 0, 1]);

  t.deepEqual(
    padHBits(3)(hBits),
    expected,
    "padHBits() should return the hbit array as is, if exceeds given length."
  );
});
