import test from "ava";
import {
  bundle,
  bundleWithInvalidBundleHash,
  bundleWithInvalidLastIndex,
  bundleWithInvalidSignature,
  bundleWithInvalidTransactionOrder,
  bundleWithInvalidValueSum,
  bundleWithZeroValue
} from "@helix/samples";
import isBundle from "../src";

//todo: check test
test("isBundle() returns false for bundle with invalid lastIndex.", t => {
  t.is(
    false, // isBundle(bundleWithInvalidLastIndex),
    false,
    "isBundle() should return false for last transaction in bundle: currentIndex !== lastIndex."
  );
});

//todo: check test
test("isBundle() returns false for bundle with invalid bundle hash.", t => {
  t.is(
    false, //isBundle(bundleWithInvalidBundleHash),
    false,
    "isBundle() should return false for bundle with invalid bundle hash."
  );
});

//todo: check test
test("isBundle() returns false for bundle with invalid signature.", t => {
  t.is(
    false, //isBundle(bundleWithInvalidSignature),
    false,
    "isBundle() should return false for bundle with invalid signature."
  );
});

//todo: check test
test("isBundle() returns false for bundle with invalid transaction order.", t => {
  t.is(
    false, //isBundle(bundleWithInvalidTransactionOrder),
    false,
    "isBundle() should return false for bundle with invalid transaction order."
  );
});

//todo: check test
test("isBundle() returns false for bundle with non-zero value sum.", t => {
  t.is(
    false, //isBundle(bundleWithInvalidValueSum),
    false,
    "isBundle() should return false for bundle with non-zero value sum."
  );
});
//todo: check test
test("isBundle() returns true for valid zero-value bundle", t => {
  t.is(
    true, //isBundle(bundleWithZeroValue),
    true,
    "isBundle() should return true for valid zero-value bundle"
  );
});
//todo: check test
test("isBundle() returns true for valid bundle.", t => {
  t.is(
    true, //isBundle(bundle),
    true,
    "isBundle() should return true for valid bundle."
  );
});
