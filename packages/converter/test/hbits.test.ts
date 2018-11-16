import test from "ava";
import { fromValue, hbits, hBitsToHBytes, hbytesToHBits, value } from "../src";

test("Converter: Test number to bits and back to number conversion) ", t => {
  const input: Int8Array = new Int8Array([
    0x01,
    0x00,
    0x01,
    0x00,
    0x01,
    0x01,
    0x01,
    0x00
  ]);
  let bytes = hBitsToHBytes(input);
  let bit = hbytesToHBits(bytes);
  t.deepEqual(
    bit,
    input,
    "Function hBitsToHBytes and hbytesToHBits() return the same value"
  );
});

test("Converter: Test number to bits and back to number conversion) ", t => {
  const expected: number = 0x6d559fb; //114645499
  let hbits: Int8Array = fromValue(expected);
  let result1 = value(hbits.slice(0, hbits.length));
  let paddedBits =
    hbits.length < 64 ? new Int8Array(64).map((n, i) => hbits[i] || 0) : hbits;
  let bytes = hBitsToHBytes(paddedBits);
  let againToBits = hbytesToHBits(bytes);
  let result = value(againToBits.slice(0, hbits.length));
  t.deepEqual(
    result,
    expected,
    "Function hbytesToHBits() then back to value should return the same value"
  );
});

test("Function: hbits) ", t => {
  const input: string = "f1";
  const expected: Int8Array = new Int8Array([
    0x01,
    0x01,
    0x01,
    0x01,
    0x00,
    0x00,
    0x00,
    0x01
  ]);

  t.deepEqual(
    hbits(input),
    expected,
    "Conversion from hBytes to hbits is not correctly!"
  );
});

test("Function2: hbits) ", t => {
  const input: string = "f12e";
  const expected: Int8Array = new Int8Array([
    0x01,
    0x01,
    0x01,
    0x01,
    0x00,
    0x00,
    0x00,
    0x01,
    0x00,
    0x00,
    0x01,
    0x00,
    0x01,
    0x01,
    0x01,
    0x00
  ]);

  t.deepEqual(
    hbits(input),
    expected,
    "Conversion from hBytes to hbits is not correctly!"
  );
});

test("Function3: hbits) ", t => {
  const input: string = "a";
  const expected: Int8Array = new Int8Array([0x01, 0x00, 0x01, 0x00]);

  t.deepEqual(
    hbits(input),
    expected,
    "Conversion from hBytes to hbits is not correctly!"
  );
});

test("Function: hbits - from number) ", t => {
  const input: number = 241;
  const expected: Int8Array = new Int8Array([
    0x01,
    0x00,
    0x00,
    0x00,
    0x01,
    0x01,
    0x01,
    0x01
  ]);

  t.deepEqual(
    hbits(input),
    expected,
    "Conversion from hBytes to hbits is not correctly!"
  );
});

test("Function: hbits - from number more than one byte) ", t => {
  const input: number = 0x237;
  const expected: Int8Array = new Int8Array([
    0x01,
    0x01,
    0x01,
    0x00,
    0x01,
    0x01,
    0x00,
    0x00,
    0x00,
    0x01
  ]);

  t.deepEqual(
    hbits(input),
    expected,
    "Conversion from hBytes to hbits is not correctly expected 10 bits!"
  );
});

test("Converter: Test value) ", t => {
  const input: Int8Array = new Int8Array([
    0x00,
    0x01,
    0x01,
    0x01,
    0x01,
    0x00,
    0x00,
    0x01,
    0x01,
    0x01,
    0x01,
    0x00
  ]);
  const expected: number = 1950; // 0x79e

  t.deepEqual(
    value(input),
    expected,
    "Function value() should return correct value"
  );
});

test("Converter: Test value) ", t => {
  const input: Int8Array = new Int8Array([0x00, 0x00, 0x01, 0x01]);

  const expected: number = 0xc;

  t.deepEqual(
    value(input),
    expected,
    "Function value() should return correct value"
  );
});

test("Converter: Test value) ", t => {
  const input: Int8Array = new Int8Array([0x01, 0x01, 0x00, 0x00]);

  const expected: number = 0x3;

  t.deepEqual(
    value(input),
    expected,
    "Function value() should return correct value"
  );
});

test("Converter: Test hBitsToHBytes) ", t => {
  const input: Int8Array = new Int8Array([
    0x00,
    0x01,
    0x01,
    0x01,
    0x01,
    0x00,
    0x00,
    0x01,
    0x01,
    0x01,
    0x01,
    0x00
  ]);
  const expected: string = "79e"; // 79e
  t.deepEqual(
    hBitsToHBytes(input),
    expected,
    "Function hBitsToHBytes() should return correct value"
  );
});

test("Converter: Test value) ", t => {
  const input: Int8Array = new Int8Array([
    0x01,
    0x00,
    0x00,
    0x00,
    0x01,
    0x01,
    0x01,
    0x01
  ]);
  const expected: number = 241;

  t.deepEqual(
    value(input),
    expected,
    "Function value() should return correct value"
  );
});
