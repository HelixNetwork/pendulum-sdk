import test from "ava";
import { bytesToWords, wordsToBytes, hex } from "@helix/converter";
import SHA256 from "../src";
import * as CryptoJS from "crypto-js";

test("SHA256: Test sha256 (update/final), Converter: bytesToWords()/wordsTobytes(),bytesToHexString()", t => {
  let size = 16;
  const inputBytes = new Uint8Array(16);
  for (let i = 0; i < size; i++) {
    inputBytes[i] = i;
  }
  let sha256 = (CryptoJS.algo as any).SHA256.create();
  var expectedResult: string = sha256
    .update(CryptoJS.lib.WordArray.create(bytesToWords(inputBytes)))
    .clone()
    .finalize()
    .toString();

  const simpleSHA256 = (inputBytes: Uint8Array): string => {
    const sha256: SHA256 = new SHA256();
    sha256.initialize();
    sha256.absorb(inputBytes, 0, SHA256.HASH_LENGTH);
    const hashBytes: Uint8Array = new Uint8Array(SHA256.HASH_LENGTH);
    sha256.squeeze(hashBytes, 0, SHA256.HASH_LENGTH);
    return hex(hashBytes);
  };
  t.is(
    simpleSHA256(inputBytes),
    expectedResult,
    "SHA256 should produce correct hash"
  );
});

test("SHA256: Test sha256 input string (update/final), Converter: bytesToWords()/wordsTobytes()/bytesToHexString()", t => {
  const input = "abcdefghijklmnopqrstuvwxyz";
  const expected =
    "71c480df93d6ae2f1efad1447c66c9525e316218cf51fc8d9ed832f2daf18b73";

  const simpleSHA256 = (input: string): string => {
    const sha256: SHA256 = new SHA256();
    sha256.initialize();

    sha256.absorb(input, 0, SHA256.HASH_LENGTH);
    const hashBytes: Uint8Array = new Uint8Array(SHA256.HASH_LENGTH);
    sha256.squeeze(hashBytes, 0, SHA256.HASH_LENGTH);
    return hex(hashBytes);
  };

  t.is(
    simpleSHA256(input),
    expected,
    "SHA256InputString should produce correct hash"
  );
});
