import test from "ava";
import { padTxBits, padTxHex } from "../src";

test("padTxBits() adds padding to hbit array.", t => {
  const hBits = new Int8Array([1, 0, 1]);
  const expected = new Int8Array([0, 0, 0, 1, 0, 1]);

  t.deepEqual(
    padTxBits(6)(hBits),
    expected,
    "padTxBits() should add padding to hbit array."
  );
});

test("padTxBits() returns the hbit array as is, if exceeds given length.", t => {
  const hBits = new Int8Array([1, 0, 1]);
  const expected = new Int8Array([1, 0, 1]);

  t.deepEqual(
    padTxBits(3)(hBits),
    expected,
    "padTxBits() should return the hbit array as is, if exceeds given length."
  );
});
