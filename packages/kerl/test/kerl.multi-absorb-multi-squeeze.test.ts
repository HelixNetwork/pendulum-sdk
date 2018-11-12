import test from "ava";
import { trits, hbytes } from "@helix/converter";
import Kerl from "../src";

test("Kerl: multi-absorb()/multi-squeeze(), Converter: trits()/hbytes()", t => {
  const input: string =
    "G9JYBOMPUXHYHKSNRNMMSSZCSHOFYOYNZRSZMAAYWDYEIMVVOGKPJBVBM9TDPULSFUNMTVXRKFIDOHUXXVYDLFSZYZTWQYTE9SPYYWYTXJYQ9IFGYOLZXWZBKWZN9QOOTBQMWMUBLEWUEEASRHRTNIQWJQNDWRYLCA";
  const expected: string =
    "LUCKQVACOGBFYSPPVSSOXJEKNSQQRQKPZC9NXFSMQNRQCGGUL9OHVVKBDSKEQEBKXRNUJSRXYVHJTXBPDWQGNSCDCBAIRHAQCOWZEBSNHIJIGPZQITIBJQ9LNTDIBTCQ9EUWKHFLGFUVGGUWJONK9GBCDUIMAYMMQX";

  const multiAbsorbMultiSqueeze = (inputHBytes: string): string => {
    const inputTrits: Int8Array = trits(inputHBytes);
    const kerl: Kerl = new Kerl();
    kerl.initialize();
    kerl.absorb(inputTrits, 0, inputTrits.length);
    const hashTrits = new Int8Array(Kerl.HASH_LENGTH * 2);
    kerl.squeeze(hashTrits, 0, Kerl.HASH_LENGTH * 2);
    return hbytes(hashTrits);
  };

  t.is(
    multiAbsorbMultiSqueeze(input),
    expected,
    "Kerl should produce correct hash for multi-absorb/multi-squeeze case."
  );
});
