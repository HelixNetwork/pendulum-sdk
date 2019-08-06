import test from "ava";
import * as errors from "../src/errors";
import { txsToAscii } from "../src";

const { INVALID_ODD_LENGTH, INVALID_TX_HEX } = errors;

test("txsToAscii()", t => {
  const txs = "494f5441";
  const expected = "IOTA";

  const nonTxHex = "AAAfasds";
  const txsOfOddLength = "aaa";

  t.is(
    txsToAscii(txs),
    expected,
    "fromTxHex() should convert transactionStrings to ascii."
  );

  const invalidTxHexError = t.throws(
    () => txsToAscii(nonTxHex),
    Error,
    "fromTxHex() should throw error for non-transactionStrings."
  );

  t.is(invalidTxHexError.message, INVALID_TX_HEX, "incorrect error message");

  const oddLengthError = t.throws(
    () => txsToAscii(txsOfOddLength),
    Error,
    "fromTxHex() should throw error for transactionStrings of odd length."
  );

  t.is(oddLengthError.message, INVALID_ODD_LENGTH, "incorrect error message");
});
