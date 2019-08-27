import {
  bundleWithEmptyJSON,
  bundleWithInvalidJSON,
  bundleWithJSON,
  bundleWithMultipleJSONMessageFragments,
  parsedJSON,
  parsedJSONOfMultipleMessageFragments
} from "@helixnetwork/samples";
import test from "ava";
import { any } from "bluebird";
import { SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE } from "../../constants";
import { errors, extractJson } from "../src";

test("extractJson() parses JSON object.", t => {
  t.is(
    extractJson(bundleWithJSON),
    parsedJSON,
    "extractJson() should return parsed object for bundle with valid txs encoded JSON."
  );
});

test("extractJson() parses JSON object over multiple signature message fragments.", t => {
  t.is(
    extractJson(bundleWithMultipleJSONMessageFragments),
    parsedJSONOfMultipleMessageFragments,
    "extractJson() should return parsed object for bundle with valid txs encoded JSON in multiple message fragments."
  );
});

test("extractJson() parses empty JSON object.", t => {
  t.is(
    extractJson(bundleWithEmptyJSON),
    "{}",
    "extractJson() should return empty object for bundle with empty txs encoded JSON."
  );
});

test("extraJson() parses boolean values.", t => {
  t.is(
    extractJson(
      bundleWithEmptyJSON.map((tx: any) => ({
        ...tx,
        signatureMessageFragment:
          "66616c7365" + "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE - 10)
      }))
    ),
    "false",
    'extractJson() should parse "false" boolean values.'
  );

  t.is(
    extractJson(
      bundleWithEmptyJSON.map((tx: any) => ({
        ...tx,
        signatureMessageFragment:
          "74727565" + "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE - 8)
      }))
    ),
    "true",
    'extractJson() should parse "true" boolean values.'
  );
});

test("extraJson() parses string values.", t => {
  t.is(
    extractJson(
      bundleWithEmptyJSON.map((tx: any) => ({
        ...tx,
        signatureMessageFragment:
          "2268656c6c6f2122" +
          "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE - 16)
      }))
    ),
    JSON.stringify("hello!"),
    "extractJson() should parse string values."
  );
});

test("extraJson() parses JSON arrays.", t => {
  t.is(
    extractJson(
      bundleWithEmptyJSON.map((tx: any) => ({
        ...tx,
        signatureMessageFragment:
          "5b312c322c22746872656521225d" +
          "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE - 28)
      }))
    ),
    JSON.stringify([1, 2, "three!"]),
    "extractJson() should parse arrays."
  );
});

test("extraJson() parses null.", t => {
  t.is(
    extractJson(
      bundleWithEmptyJSON.map((tx: any) => ({
        ...tx,
        signatureMessageFragment:
          "6e756c6c" + "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE - 8)
      }))
    ),
    JSON.stringify(null),
    "extractJson() should parse null."
  );
});

test("extractJson() parses numbers", t => {
  t.is(
    extractJson(
      bundleWithEmptyJSON
        .map((tx: any) => ({
          ...tx,
          signatureMessageFragment:
            "33" + "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE - 2)
        }))
        .slice(0, 1)
    ),
    3,
    "extractJson() should parse integers"
  );

  t.is(
    extractJson(
      bundleWithEmptyJSON
        .map((tx: any) => ({
          ...tx,
          signatureMessageFragment:
            "2d33" + "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE - 2)
        }))
        .slice(0, 1)
    ),
    -3,
    "extractJson() should parse negative integers"
  );

  t.is(
    extractJson(
      bundleWithEmptyJSON
        .map((tx: any) => ({
          ...tx,
          signatureMessageFragment:
            "332e3134" + "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE - 8)
        }))
        .slice(0, 1)
    ),
    3.14,
    "extractJson() should parse positive floats"
  );

  t.is(
    extractJson(
      bundleWithEmptyJSON
        .map((tx: any) => ({
          ...tx,
          signatureMessageFragment:
            "332e3134" + "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE - 10)
        }))
        .slice(0, 1)
    ),
    3.14,
    "extractJson() should parse positive floats (with sign)"
  );

  t.is(
    extractJson(
      bundleWithEmptyJSON
        .map((tx: any) => ({
          ...tx,
          signatureMessageFragment:
            "2d332e3134" + "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE - 10)
        }))
        .slice(0, 1)
    ),
    -3.14,
    "extractJson() should parse negative floats"
  );
  t.is(
    extractJson(
      bundleWithEmptyJSON
        .map((tx: any) => ({
          ...tx,
          signatureMessageFragment:
            "313233303030" +
            "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE - 12)
        }))
        .slice(0, 1)
    ),
    123000,
    "extractJson() should parse exponential"
  );
});

test("extractJson() throws error for invalid bundle.", t => {
  t.is(
    t.throws(() => extractJson([]), Error).message,
    errors.INVALID_BUNDLE,
    "extractJson() should throw correct error for invalid bundle."
  );
});

test("extractJson() throws error for invalid JSON.", t => {
  t.is(
    t.throws(() => extractJson(bundleWithInvalidJSON), Error).message,
    errors.INVALID_JSON,
    "extractJson() should throw correct error for invalid JSON."
  );
});
