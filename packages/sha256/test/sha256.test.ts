import test from "ava";
import { trits, trytes, asciiToTrytes, trytesToAscii } from "@helix/converter";
import SHA256 from "../src";
import { tritsToWords, wordsToTrits } from "../src/word-converter";

test("SHA256: Test sha256 (update/final), Converter: trits()/trytes()", t => {
  const input =
    "GYOMKVTSNHVJNCNFBBAH9AAMXLPLLLROQY99QN9DLSJUHDPBLCFFAIQXZA9BKMBJCYSFHFPXAHDWZFEIZ";
  const expected =
    "I9UFDJVHPMGYSGMEUQDSQRZVXYVPPDSHJWBPJCDABHTKSTOBACDG9WNNNNNNNNNNNNNNNNNNNNNNNNNNW";

  const simpleSHA256 = (inputTrytes: string): string => {
    const inputTrits: Int8Array = trits(inputTrytes);
    const sha256: SHA256 = new SHA256();
    sha256.initialize();
    sha256.update(inputTrits, 0, SHA256.HASH_LENGTH);
    const hashTrits: Int8Array = new Int8Array(SHA256.HASH_LENGTH);
    sha256.final(hashTrits, 0, SHA256.HASH_LENGTH);
    return trytes(hashTrits);
  };
  t.is(simpleSHA256(input), expected, "SHA256 should produce correct hash");
});
