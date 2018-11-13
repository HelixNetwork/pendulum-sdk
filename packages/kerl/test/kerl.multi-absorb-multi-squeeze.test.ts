import test from "ava";
import { hbits, hbytes } from "@helix/converter";
import Kerl from "../src";

test("Kerl: multi-absorb()/multi-squeeze(), Converter: hbits()/hbytes()", t => {
  const input: string =
    "G9JYBOMPUXHYHKSNRNMMSSZCSHOFYOYNZRSZMAAYWDYEIMVVOGKPJBVBM9TDPULSFUNMTVXRKFIDOHUXXVYDLFSZYZTWQYTE9SPYYWYTXJYQ9IFGYOLZXWZBKWZN9QOOTBQMWMUBLEWUEEASRHRTNIQWJQNDWRYLCA";
  const expected: string =
    "LUCKQVACOGBFYSPPVSSOXJEKNSQQRQKPZC9NXFSMQNRQCGGUL9OHVVKBDSKEQEBKXRNUJSRXYVHJTXBPDWQGNSCDCBAIRHAQCOWZEBSNHIJIGPZQITIBJQ9LNTDIBTCQ9EUWKHFLGFUVGGUWJONK9GBCDUIMAYMMQX";

  const multiAbsorbMultiSqueeze = (inputHBytes: string): string => {
    const inputHBits: Int8Array = hbits(inputHBytes);
    const kerl: Kerl = new Kerl();
    kerl.initialize();
    kerl.absorb(inputHBits, 0, inputHBits.length);
    const hashHBits = new Int8Array(Kerl.HASH_LENGTH * 2);
    kerl.squeeze(hashHBits, 0, Kerl.HASH_LENGTH * 2);
    return hbytes(hashHBits);
  };

  t.is(
    multiAbsorbMultiSqueeze(input),
    expected,
    "Kerl should produce correct hash for multi-absorb/multi-squeeze case."
  );
});
