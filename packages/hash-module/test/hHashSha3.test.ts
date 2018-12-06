import test from "ava";
import {
  bytesToWords,
  wordsToBytes,
  hex,
  toHBytes
} from "@helixnetwork/converter";
import HHash from "../src";

test("hash-module: Test sha3 input string (update/final), Converter: bytesToWords()/wordsTobytes()/bytesToHexString()", t => {
  const input =
    "964b398ecd55793d8ca93e01274efe1377a70c8dc358fdca17cb4e94a9ed7777";
  const expected =
    "c2a26a52b0da35baf172d0069cf890f47e351a184b534fffa7d9e4366532d9f9";
  const simpleSha3 = (input: string): string => {
    const hHash: HHash = new HHash(HHash.HASH_ALGORITHM_3);
    hHash.initialize();

    hHash.absorb(toHBytes(input), 0, hHash.getHashLength());
    const hashBytes: Int8Array = new Int8Array(hHash.getHashLength());
    hHash.squeeze(hashBytes, 0, hHash.getHashLength());
    return hex(hashBytes);
  };

  t.is(
    simpleSha3(input),
    expected,
    "HHash with Sha3 InputString should produce correct hash"
  );
});
