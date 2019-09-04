import { hex, toTxBytes } from "@helixnetwork/converter";
import test from "ava";
import Sha3 from "../src";

test("Sha3: absorb()/squeeze(), Converter: toTxBytes()/hex()", t => {
  const input =
    "964b398ecd55793d8ca93e01274efe1377a70c8dc358fdca17cb4e94a9ed7777";
  const expected =
    "c02c4aa8852301f3eb7b926f320d911bb178ba1ec4159f67d6cc1d75ef9a62f8";
  // tslint:disable-next-line:no-shadowed-variable
  const absorbSqueeze = (input: string): string => {
    const inputBytes = toTxBytes(input);
    const sha3: Sha3 = new Sha3();
    sha3.absorb(inputBytes, 0, inputBytes.length);
    const hastxs = new Uint8Array(Sha3.HASH_LENGTH);
    sha3.squeeze(hastxs, 0, Sha3.HASH_LENGTH);
    return hex(hastxs);
  };

  t.is(
    absorbSqueeze(input),
    expected,
    "Sha3 should produce correct hash for absorb/squeeze case."
  );
});
