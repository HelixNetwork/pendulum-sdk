import test from "ava";
import * as errors from "../src/errors";
import { hbytesToAscii } from "../src";

const { INVALID_ODD_LENGTH, INVALID_HBYTES } = errors;

test("hbytesToAscii()", t => {
  const hbytes = "SBYBCCKB";
  const expected = "IOTA";

  const nonHBytes = "AAAfasds";
  const hbytesOfOddLength = "AAA";

  t.is(
    hbytesToAscii(hbytes),
    expected,
    "fromHBytes() should convert hbytes to ascii."
  );

  const invalidHBytesError = t.throws(
    () => hbytesToAscii(nonHBytes),
    Error,
    "fromHBytes() should throw error for non-hbytes."
  );

  t.is(invalidHBytesError.message, INVALID_HBYTES, "incorrect error message");

  const oddLengthError = t.throws(
    () => hbytesToAscii(hbytesOfOddLength),
    Error,
    "fromHBytes() should throw error for hbytes of odd length."
  );

  t.is(oddLengthError.message, INVALID_ODD_LENGTH, "incorrect error message");
});
