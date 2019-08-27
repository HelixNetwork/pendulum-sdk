import test from "ava";
import { asciiToTxHex } from "../src";
import { INVALID_ASCII_CHARS } from "../src/errors";

test("asciiToBytes()", t => {
  const ascii = "IOTA";
  const utf8 = "Γιώτα";
  const expected = "494f5441";

  t.is(
    asciiToTxHex(ascii),
    expected,
    "asciiToTxHex() should correctly convert ascii to bytes."
  );

  const error = t.throws(
    () => asciiToTxHex(utf8),
    Error,
    "asciiToTxHex() should throw error for non-ascii input."
  );

  t.is(error.message, INVALID_ASCII_CHARS);
});
