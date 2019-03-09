import test from "ava";
import { generateKey, encrypt, decrypt, importKeyFiles } from "../src";

test("RSA: encrypt()/decrypt()", t => {
  const message =
    "c213d39764dd60a0174a134ed8f7047dc7d14ff882a4355469a72732788ef3a3";
  const key = generateKey();
  const encryptDecrypt = (input: string): string => {
    const encrypted = encrypt(input, key);
    return decrypt(encrypted, key);
  };
  t.is(
    encryptDecrypt(message),
    message,
    "Encrypted and then decrypted message should correspond to the original message."
  );
});
