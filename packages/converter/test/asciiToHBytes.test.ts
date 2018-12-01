import test from "ava";
import { INVALID_ASCII_CHARS } from "../src/errors";
import { asciiToHBytes } from "../src";

test("asciiToBytes()", t => {
  const ascii = "IOTA";
  const utf8 = "Γιώτα";
  const expected = "494f5441";

  t.is(
    asciiToHBytes(ascii),
    expected,
    "asciiToHBytes() should correctly convert ascii to bytes."
  );

  const error = t.throws(
    () => asciiToHBytes(utf8),
    Error,
    "asciiToHBytes() should throw error for non-ascii input."
  );

  t.is(error.message, INVALID_ASCII_CHARS);
});
