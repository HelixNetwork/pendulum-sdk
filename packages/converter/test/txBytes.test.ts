import test from "ava";
import { bytesToWords, wordsToBytes } from "../src";

test("Converter: Test bytesToWords and wordsToBytes) ", t => {
  const size = 16;
  const input = new Uint8Array(16);

  input[size - 2] = 0xffff;

  for (let i = 0; i < size - 1; i++) {
    input[i] = i;
  }

  const words: Uint32Array = bytesToWords(input);
  const result: Uint8Array = wordsToBytes(words);

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

test("Converter: Test wordToBytes and bytesToWord) ", t => {
  const words: Uint32Array = new Uint32Array([
    2820297144,
    2904997331,
    866899857,
    802360334,
    136566105,
    3403438082,
    413286435,
    2324087442
  ]);

  const size = words.length;

  const bytes: Uint8Array = wordsToBytes(words);
  const result: Uint32Array = bytesToWords(bytes);

  t.is(
    result.length,
    words.length,
    "Conversion from byte to word and reverse is not correctly! Size is different"
  );

  for (let i = 0; i < size; i++) {
    t.is(
      result[i],
      words[i],
      "Conversion from byte to word and reverse is not correctly! Value is different"
    );
  }
});
