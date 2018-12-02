import test from "ava";
import { bytesToWords, wordsToBytes, hex } from "@helixnetwork/converter";
import SHA256 from "../src";

test("SHA256: Test sha256Multiple (update/final), Converter: bytesToWords()/wordsTobytes()", t => {
  const input = "abcdefghijklmnopqrstuvwxyz";
  const expected =
    "71c480df93d6ae2f1efad1447c66c9525e316218cf51fc8d9ed832f2daf18b73ca139bc10c2f660da42666f72e89a225936fc60f193c161124a672050c434671";

  const simpleSHA256 = (input: string): string => {
    const sha256: SHA256 = new SHA256();
    sha256.initialize();

    sha256.absorb(input, 0, SHA256.HASH_LENGTH);
    const hashBytes: Uint8Array = new Uint8Array(SHA256.HASH_LENGTH * 2);
    sha256.squeeze(hashBytes, 0, SHA256.HASH_LENGTH * 2);
    return hex(hashBytes);
  };
  t.is(
    simpleSHA256(input),
    expected,
    "SHA256Multiple should produce correct hash"
  );
});
