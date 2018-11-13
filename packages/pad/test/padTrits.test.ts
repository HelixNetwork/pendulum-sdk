import test from "ava";
import { padHBits, padHBytes } from "../src";

test("padHBits() adds padding to trit array.", t => {
  const trits = new Int8Array([-1, 0, 1]);
  const expected = new Int8Array([-1, 0, 1, 0, 0, 0]);

  t.deepEqual(
    padHBits(6)(trits),
    expected,
    "padHBits() should add padding to trit array."
  );
});

test("padHBits() returns the trit array as is, if exceeds given length.", t => {
  const trits = new Int8Array([-1, 0, 1]);
  const expected = new Int8Array([-1, 0, 1]);

  t.deepEqual(
    padHBits(3)(trits),
    expected,
    "padHBits() should return the trit array as is, if exceeds given length."
  );
});
