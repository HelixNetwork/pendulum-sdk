import { hex, toHBytes } from "@helixnetwork/converter";
import test from "ava";
import Rsa from "../src";

/** @todo wip */
test("RSA: encrypt()/decrypt()", t => {
  const input =
    "c02c4aa8852301f3eb7b926f320d911bb178ba1ec4159f67d6cc1d75ef9a62f8";
  const encryptDecrypt = (input: string): string => {
    let output = input; // encrypt/decrypt here
    return output;
  };

  t.is(
    encryptDecrypt(input),
    input,
    "Encrypted and decrypted message should corrrespond to pre-image."
  );
});
