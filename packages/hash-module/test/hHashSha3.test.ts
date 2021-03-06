import {
  bytesToWords,
  hex,
  toTxBytes,
  wordsToBytes
} from "@helixnetwork/converter";
import test from "ava";
import HHash from "../src";

test("hash-module: Test sha3 input string (update/final), Converter: bytesToWords()/wordsTobytes()/bytesToHexString()", t => {
  const input =
    "964b398ecd55793d8ca93e01274efe1377a70c8dc358fdca17cb4e94a9ed7777";
  const expected =
    "c02c4aa8852301f3eb7b926f320d911bb178ba1ec4159f67d6cc1d75ef9a62f8";
  const simpleSha3 = (inputValue: string): string => {
    const hHash: HHash = new HHash(HHash.HASH_ALGORITHM_3);
    hHash.initialize();

    hHash.absorb(toTxBytes(inputValue), 0, hHash.getHashLength());
    const hastxHex: Int8Array = new Int8Array(hHash.getHashLength());
    hHash.squeeze(hastxHex, 0, hHash.getHashLength());
    return hex(hastxHex);
  };

  t.is(
    simpleSha3(input),
    expected,
    "HHash with Sha3 InputString should produce correct hash"
  );
});
