import test from "ava";
import { hbits, hbytes } from "@helix/converter";
import Kerl from "../src";

test("Kerl: absorb()/squeeze(), Converter: hbits()/hbytes()", t => {
  const input =
    "GYOMKVTSNHVJNCNFBBAH9AAMXLPLLLROQY99QN9DLSJUHDPBLCFFAIQXZA9BKMBJCYSFHFPXAHDWZFEIZ";
  const expected =
    "OXJCNFHUNAHWDLKKPELTBFUCVW9KLXKOGWERKTJXQMXTKFKNWNNXYD9DMJJABSEIONOSJTTEVKVDQEWTW";

  const absorbSqueeze = (inputHBytes: string): string => {
    const inputHBits: Int8Array = hbits(inputHBytes);
    const kerl: Kerl = new Kerl();
    kerl.initialize();
    kerl.absorb(inputHBits, 0, inputHBits.length);
    const hashHBits = new Int8Array(Kerl.HASH_LENGTH);
    kerl.squeeze(hashHBits, 0, Kerl.HASH_LENGTH);
    return hbytes(hashHBits);
  };

  t.is(
    absorbSqueeze(input),
    expected,
    "Kerl should produce correct hash for absorb/squeeze case."
  );
});
