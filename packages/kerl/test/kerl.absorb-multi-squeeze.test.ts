import test from "ava";
import { hbits, hbytes } from "@helix/converter";
import Kerl from "../src";

test("Kerl: absorb()/multi-squeeze(), Converter: hbits()/hbytes()", t => {
  const input =
    "9MIDYNHBWMBCXVDEFOFWINXTERALUKYYPPHKP9JJFGJEIUY9MUDVNFZHMMWZUYUSWAIOWEVTHNWMHANBH";
  const expected =
    "G9JYBOMPUXHYHKSNRNMMSSZCSHOFYOYNZRSZMAAYWDYEIMVVOGKPJBVBM9TDPULSFUNMTVXRKFIDOHUXXVYDLFSZYZTWQYTE9SPYYWYTXJYQ9IFGYOLZXWZBKWZN9QOOTBQMWMUBLEWUEEASRHRTNIQWJQNDWRYLCA";

  const absorbMultiSqueeze = (inputHBytes: string): string => {
    const inputHBits: Int8Array = hbits(inputHBytes);
    const kerl: Kerl = new Kerl();
    kerl.initialize();
    kerl.absorb(inputHBits, 0, inputHBits.length);
    const hashHBits: Int8Array = new Int8Array(Kerl.HASH_LENGTH * 2);
    kerl.squeeze(hashHBits, 0, Kerl.HASH_LENGTH * 2);
    return hbytes(hashHBits);
  };

  t.is(
    absorbMultiSqueeze(input),
    expected,
    "Kerl should produce correct hash for absorb/multi-squeeze case."
  );
});
