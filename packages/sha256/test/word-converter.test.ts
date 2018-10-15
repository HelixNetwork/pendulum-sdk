import test from "ava";
import { bytesToWords, wordsToBytes } from "../src/word-converter";

test("SHA256: Test convertor (bytesToWords,wordsToBytes) ", t => {
  let size = 16;
  const input = new Int8Array(16);

  for (let i = 0; i < size; i++) {
    input[i] = i;
  }

  let words: Uint32Array = bytesToWords(input);
  let result: Int8Array = wordsToBytes(words);

  t.is(
    result.length,
    input.length,
    "Conversion from byte to word and reverse is not correctly! Size is different"
  );

  for (let i = 0; i < size; i++) {
    t.is(
      result[i],
      input[i],
      "Conversion from byte to word and reverse is not correctly! Value is different"
    );
  }
});
