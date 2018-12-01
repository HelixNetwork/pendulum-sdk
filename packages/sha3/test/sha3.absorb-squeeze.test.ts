import { hex, toHBytes } from "@helix/converter";
import test from "ava";
import Sha3 from "../src";

test("Sha3: absorb()/squeeze(), Converter: toHBytes()/hex()", t => {
  const input =
    "964b398ecd55793d8ca93e01274efe1377a70c8dc358fdca17cb4e94a9ed7777";
  const expected =
    "c2a26a52b0da35baf172d0069cf890f47e351a184b534fffa7d9e4366532d9f9";
  const absorbSqueeze = (input: string): string => {
    const inputBytes = toHBytes(input);
    const sha3: Sha3 = new Sha3();
    sha3.absorb(inputBytes, 0, inputBytes.length);
    const hashBytes = new Uint8Array(Sha3.HASH_LENGTH);
    sha3.squeeze(hashBytes, 0, Sha3.HASH_LENGTH);
    return hex(hashBytes);
  };

  t.is(
    absorbSqueeze(input),
    expected,
    "Sha3 should produce correct hash for absorb/squeeze case."
  );
});
