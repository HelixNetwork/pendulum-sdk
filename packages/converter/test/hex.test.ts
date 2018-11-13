import test from "ava";
import { hex, toHBytes } from "../src";

test("Converter: hex) ", t => {
  const input: Uint8Array = new Uint8Array([0xff, 0x01, 0x34, 0x00]);
  const expected = "ff013400";

  t.is(hex(input), expected, "Conversion from bytes to hex is not correctly!");
});

test("Converter: Test toBytes) ", t => {
  const input = 0x89;
  const expected: Uint8Array = new Uint8Array([0x89]);
  t.deepEqual(
    toHBytes(input, 0),
    expected,
    "Function toBytes() should return correct value"
  );
});

test("Converter: Test bytes) ", t => {
  const input = "89";
  const expected: Uint8Array = new Uint8Array([0x89]);
  t.deepEqual(
    toHBytes(input),
    expected,
    "Function bytes() should return correct value"
  );
});
