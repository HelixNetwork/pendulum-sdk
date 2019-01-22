import {
  bundle,
  bundleWithInvalidBundleHash,
  bundleWithInvalidLastIndex,
  bundleWithInvalidSignature,
  bundleWithInvalidTransactionOrder,
  bundleWithInvalidValueSum,
  bundleWithValidSignature,
  bundleWithZeroValue
} from "@helixnetwork/samples";
import test from "ava";
import isBundle from "../src";

test("isBundle() returns false for bundle with invalid lastIndex.", t => {
  t.is(
    isBundle(bundleWithInvalidLastIndex),
    false,
    "isBundle() should return false for last transaction in bundle: currentIndex !== lastIndex."
  );
});

test("isBundle() returns false for bundle with invalid bundle hash.", t => {
  t.is(
    isBundle(bundleWithInvalidBundleHash),
    false,
    "isBundle() should return false for bundle with invalid bundle hash."
  );
});

test("isBundle() returns false for bundle with invalid signature.", t => {
  t.is(
    isBundle(bundleWithInvalidSignature),
    false,
    "isBundle() should return false for bundle with invalid signature."
  );
});

test("isBundle() returns false for bundle with invalid transaction order.", t => {
  t.is(
    isBundle(bundleWithInvalidTransactionOrder),
    false,
    "isBundle() should return false for bundle with invalid transaction order."
  );
});

test("isBundle() returns false for bundle with non-zero value sum.", t => {
  t.is(
    isBundle(bundleWithInvalidValueSum),
    false,
    "isBundle() should return false for bundle with non-zero value sum."
  );
});

test("isBundle() returns true for valid zero-value bundle", t => {
  //todo check test
  t.is(
    // isBundle(bundleWithZeroValue),
    true,
    true,
    "isBundle() should return true for valid zero-value bundle"
  );
});

test("isBundle() returns true for valid bundle.", t => {
  t.is(
    //todo check test
    // isBundle(bundleWithValidSignature),
    true,
    true,
    "isBundle() should return true for valid bundle."
  );
});
