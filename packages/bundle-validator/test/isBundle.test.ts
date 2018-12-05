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
// todo_this : check test
test("isBundle() returns false for bundle with invalid lastIndex.", t => {
  // t.is(
  //   isBundle(bundleWithInvalidLastIndex),
  //   false,
  //   "isBundle() should return false for last transaction in bundle: currentIndex !== lastIndex."
  // );
});
// todo_this : check test
// test("isBundle() returns false for bundle with invalid bundle hash.", t => {
//   t.is(
//     isBundle(bundleWithInvalidBundleHash),
//     false,
//     "isBundle() should return false for bundle with invalid bundle hash."
//   );
// });

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
// todo_this : check test
// test("isBundle() returns false for bundle with non-zero value sum.", t => {
//   t.is(
//     isBundle(bundleWithInvalidValueSum),
//     false,
//     "isBundle() should return false for bundle with non-zero value sum."
//   );
// });
// todo_this : check test
// test("isBundle() returns true for valid zero-value bundle", t => {
//   t.is(
//     isBundle(bundleWithZeroValue),
//     true,
//     "isBundle() should return true for valid zero-value bundle"
//   );
// });
// todo_this : check test
// test("isBundle() returns true for valid bundle.", t => {
//   t.is(
//     isBundle(bundleWithValidSignature),
//     true,
//     "isBundle() should return true for valid bundle."
//   );
// });
