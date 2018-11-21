import test from "ava";
import {
  bundle,
  bundleWithInvalidSignature,
  bundleWithInvalidTransactionOrder
} from "@helix/samples";
import { validateBundleSignatures } from "../src";

test("validateSignatures() returns false for bundle with invalid signatures.", t =>
  t.is(
    validateBundleSignatures(bundleWithInvalidSignature),
    false,
    "validateSignatures() should return false for bundle with invalid signatures."
  ));

// test('validateSignatures() returns true for bundle with valid signatures.', t =>
//     t.is(
//         validateBundleSignatures(bundle),
//         true,
//         'validateSignatures() should return true for bundle with valid signatures.'
//     ))

// test('validateSignatures() returns true for invalid bundle with valid signatures', t =>
//     t.is(
//         validateBundleSignatures(bundleWithInvalidTransactionOrder),
//         true,
//         'validateSignatures() should return true for invalid bundle with valid signatures.'
//     ))
