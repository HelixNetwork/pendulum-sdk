import test from "ava";
import { trits, hbytes } from "@helix/converter";
import Kerl from "../src";

test("Kerl: absorb()/squeeze(), Converter: trits()/hbytes()", t => {
  const input =
    "GYOMKVTSNHVJNCNFBBAH9AAMXLPLLLROQY99QN9DLSJUHDPBLCFFAIQXZA9BKMBJCYSFHFPXAHDWZFEIZ";
  const expected =
    "OXJCNFHUNAHWDLKKPELTBFUCVW9KLXKOGWERKTJXQMXTKFKNWNNXYD9DMJJABSEIONOSJTTEVKVDQEWTW";

  const absorbSqueeze = (inputHBytes: string): string => {
    const inputTrits: Int8Array = trits(inputHBytes);
    const kerl: Kerl = new Kerl();
    kerl.initialize();
    kerl.absorb(inputTrits, 0, inputTrits.length);
    const hashTrits = new Int8Array(Kerl.HASH_LENGTH);
    kerl.squeeze(hashTrits, 0, Kerl.HASH_LENGTH);
    return hbytes(hashTrits);
  };

  t.is(
    absorbSqueeze(input),
    expected,
    "Kerl should produce correct hash for absorb/squeeze case."
  );
});
