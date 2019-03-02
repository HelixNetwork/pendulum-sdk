import test from "ava";
import Rsa from "../src";

test("RSA: encrypt()/decrypt()", t => {
    const message = "c213d39764dd60a0174a134ed8f7047dc7d14ff882a4355469a72732788ef3a3";
    const testKey = Rsa.importKeyFiles('./samples/pub-test.pem', './samples/prv-test.pem');

    const encryptDecrypt = (input: string): string => {
      const encrypted = Rsa.encrypt(input, testKey.pub);
      return Rsa.decrypt(encrypted, testKey.prv);
    };

    t.is(
      encryptDecrypt(message),
        message,
      "Encrypted and then decrypted message should correspond to the original message."
    );
  });
