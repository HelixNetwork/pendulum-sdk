import test from "ava";
import { transactionStrings } from "@helixnetwork/samples";
import { isTxHexArray } from "../src";

test("isTxHexArray()", t => {
  const invalidTxHex = [
    "QWwee12h505a524546494757484d4d3959475342535a425542544b56554d4e474f573953535439595648574b4a4d57535639455a465356504849564e5a51504c5a45",
    "AB5512505a524546494757484d4d3959475342535a425542544b56554d4e474f573953535439595648574b4a4d57535639455a465356504849564e5a51504c5a45"
  ];

  t.deepEqual(
    isTxHexArray(transactionStrings),
    true,
    "isTxHexArray() returns true for valid bytes"
  );

  t.deepEqual(
    isTxHexArray(invalidTxHex),
    false,
    "isTxHexArray() return false for invalid bytes"
  );
});
