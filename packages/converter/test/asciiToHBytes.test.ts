import test from "ava";
import { INVALID_ASCII_CHARS } from "../src/errors";
import { asciiToHBytes } from "../src";

test("asciiToHBytes()", t => {
  const ascii = "IOTA";
  const utf8 = "Γιώτα";
  const expected = "SBYBCCKB";

  t.is(
    asciiToHBytes(ascii),
    expected,
    "toHBytes() should correctly convert ascii to hbytes."
  );

  const error = t.throws(
    () => asciiToHBytes(utf8),
    Error,
    "toHBytes() should throw error for non-ascii input."
  );

  t.is(error.message, INVALID_ASCII_CHARS);
});
