import test from "ava";
import Sha3 from "../src";
import { bytesToHex, hexToBytes } from "@helixnetwork/converter";

test("Sha3: absorb() and squeeze()", t => {
  const input =
    "964b398ecd55793d8ca93e01274efe1377a70c8dc358fdca17cb4e94a9ed7777";
  const expected =
    "c2a26a52b0da35baf172d0069cf890f47e351a184b534fffa7d9e4366532d9f9";

  const absorbSqueeze = (input: string): string => {
    const sha3: Sha3 = new Sha3();
    sha3.absorb(input, 0, input.length);
    sha3.squeeze(input, 0, Sha3.HASH_LENGTH);
    return hash;
  };

  t.is(
    absorbSqueeze(input),
    expected,
    "Sha3 should produce correct hash for absorb/squeeze case."
  );
});
