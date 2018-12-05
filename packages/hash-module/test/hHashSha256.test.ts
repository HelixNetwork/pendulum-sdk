import test from "ava";
import { bytesToWords, wordsToBytes, hex } from "@helixnetwork/converter";
import HHash from "../src";

// todo_this : check test
test("hash-module: Test sha3 input string (update/final), Converter: bytesToWords()/wordsTobytes()/bytesToHexString()", t => {
  // const input = "abcdefghijklmnopqrstuvwxyz";
  // const expected =
  //   "71c480df93d6ae2f1efad1447c66c9525e316218cf51fc8d9ed832f2daf18b73";
  // const simpleSha3 = (input: string): string => {
  //   const hHash: HHash = new HHash(HHash.HASH_ALGORITHM_3);
  //   hHash.initialize();
  //   hHash.absorb(input, 0, hHash.getHashLength());
  //   const hashBytes: Int8Array = new Int8Array(hHash.getHashLength());
  //   hHash.squeeze(hashBytes, 0, hHash.getHashLength());
  //   return hex(hashBytes);
  // };
  // t.is(
  //   simpleSha3(input),
  //   expected,
  //   "HHash with Sha3 InputString should produce correct hash"
  // );
});

// test("hash-module: Test sha3 (update/final), Converter: bytesToWords()/wordsTobytes(),bytesToHexString()", t => {
//   let size = 16;
//   const inputBytes = new Uint8Array(16);
//   for (let i = 0; i < size; i++) {
//     inputBytes[i] = i;
//   }
//   const expectedResult: string =
//     "40db4eb2eaceedadb61f5a06b32de60aae17963b9f08348f9a25d063f27406e1";

//   const simpleSha3 = (inputBytes: Uint8Array): string => {
//     const hHash: HHash = new HHash(HHash.HASH_ALGORITHM_3);
//     hHash.initialize();
//     hHash.absorb(inputBytes, 0, hHash.getHashLength());
//     const hashBytes: Int8Array = new Int8Array(hHash.getHashLength());
//     hHash.squeeze(hashBytes, 0, hHash.getHashLength());
//     return hex(hashBytes);
//   };
//   t.is(
//     simpleSha3(inputBytes),
//     expectedResult,
//     "Sha3 should produce correct hash"
//   );
// });
