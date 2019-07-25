import test from "ava";
import * as errors from "../src/errors";
import { txHexToAscii } from "../src";

const { INVALID_ODD_LENGTH, INVALID_HBYTES } = errors;

test("txHexToAscii()", t => {
  const hbytes = "494f5441";
  const expected = "IOTA";

  const nonHBytes = "AAAfasds";
  const hbytesOfOddLength = "aaa";

  t.is(
    txHexToAscii(hbytes),
    expected,
    "fromHBytes() should convert hbytes to ascii."
  );

  const invalidHBytesError = t.throws(
    () => txHexToAscii(nonHBytes),
    Error,
    "fromHBytes() should throw error for non-hbytes."
  );

  t.is(invalidHBytesError.message, INVALID_HBYTES, "incorrect error message");

  const oddLengthError = t.throws(
    () => txHexToAscii(hbytesOfOddLength),
    Error,
    "fromHBytes() should throw error for hbytes of odd length."
  );

  t.is(oddLengthError.message, INVALID_ODD_LENGTH, "incorrect error message");
});
