import test from "ava";
import { hbytes } from "@helix/samples";
import { isHBytesArray } from "../src";

test("isHBytesArray()", t => {
  const invalidHBytes = [
    "QWwee12h505a524546494757484d4d3959475342535a425542544b56554d4e474f573953535439595648574b4a4d57535639455a465356504849564e5a51504c5a45",
    "AB5512505a524546494757484d4d3959475342535a425542544b56554d4e474f573953535439595648574b4a4d57535639455a465356504849564e5a51504c5a45"
  ];

  t.deepEqual(
    isHBytesArray(hbytes),
    true,
    "isHBytesArray() returns true for valid bytes"
  );

  t.deepEqual(
    isHBytesArray(invalidHBytes),
    false,
    "isHBytesArray() return false for invalid bytes"
  );
});
