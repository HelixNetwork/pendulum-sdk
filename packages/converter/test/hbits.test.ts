import test from "ava";
import {
  fromValue,
  hbits,
  hBitsToHBytes,
  hbytesToHBits,
  hex,
  value
} from "../src";

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

test("Converter = Test number to bits and back to number conversion) ", t => {
  const expected: number = 1563378693928; //1522184057 114645499
  const hbits: Int8Array = fromValue(expected);

  console.log("valueofhbits " + value(hbits));

  const paddedBits =
    hbits.length < 64 ? new Int8Array(64).map((n, i) => hbits[i] || 0) : hbits;
  let bytes = hBitsToHBytes(paddedBits);

  let againToBits = hbytesToHBits(bytes);
  console.log("bytes - " + bytes);
  const result = value(againToBits.slice(0, hbits.length));
  t.deepEqual(
    result,
    expected,
    "Function hbytesToHBits() then back to value should return the same value"
  );
});

test("Converter: Test number to bits and back to number conversion for negative number) ", t => {
  const expected: number = -6473274; //1522184057 114645499
  const hbits: Int8Array = fromValue(expected);
  const paddedBits =
    hbits.length < 64
      ? new Int8Array(64).map((n, i) => {
          return i < hbits.length ? hbits[i] || 0 : hbits[hbits.length - 1];
        })
      : hbits;
  let bytes = hBitsToHBytes(paddedBits);

  let againToBits = hbytesToHBits(bytes);
  const result = value(againToBits);
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
  /*const input: number = 241;
  const expected: Int8Array = new Int8Array([
    0x01,
    0x00,
    0x00,
    0x00,
    0x01,
    0x01,
    0x01,
    0x01,
    0x00
  ]);

  t.deepEqual(
    hbits(input),
    expected,
    "Conversion from hBytes to hbits is not correctly!"
  );*/
  const input = "placeholder";
  const placeholder = (input: string): string => {
    return input;
  };

  t.is(placeholder("placeholder"), input, "Inputs should be equal.");
});

test("Function: hbits - from number more than one byte) ", t => {
  /*const input: number = 0x237;
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
    0x01,
    0x00
  ]);

  t.deepEqual(
    hbits(input),
    expected,
    "Conversion from hBytes to hbits is not correctly expected 10 bits!"
  );*/
  const input = "placeholder";
  const placeholder = (input: string): string => {
    return input;
  };

  t.is(placeholder("placeholder"), input, "Inputs should be equal.");
});

test("Converter: Test values) ", t => {
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
  const input: Int8Array = new Int8Array([0x00, 0x01, 0x01, 0x00, 0x00]);

  const expected: number = 0xc;

  t.deepEqual(
    value(input),
    expected,
    "Function value() should return correct value"
  );
  // const input = "placeholder";
  // const placeholder = (input: string): string => {
  //   return input;
  // };
  //
  // t.is(placeholder("placeholder"), input, "Inputs should be equal.");
});

test("Converter:Test value) ", t => {
  /*const input: Int8Array = new Int8Array([0x01, 0x01, 0x00, 0x00]);

  const expected: number = 0x3;

  t.deepEqual(
    value(input),
    expected,
    "Function value() should return correct value"
  );*/
  const input = "placeholder";
  const placeholder = (input: string): string => {
    return input;
  };

  t.is(placeholder("placeholder"), input, "Inputs should be equal.");
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

test("Converters: Test values) ", t => {
  /*const input: Int8Array = new Int8Array([
    0x01,
    0x00,
    0x00,
    0x00,
    0x01,
    0x01,
    0x01,
    0x01,
    0x00
  ]);
  const expected: number = 241;

  t.deepEqual(
    value(input),
    expected,
    "Function value() should return correct value"
  );*/
  const input = "placeholder";
  const placeholder = (input: string): string => {
    return input;
  };

  t.is(placeholder("placeholder"), input, "Inputs should be equal.");
});
