import test from "ava";
//import * as Schnorr from "../src";
import Schnorr from "../src/schnorr";
import { hex, toHBytes } from "@helix/converter";
import { type } from "os";

test("Signing test schnorr signature!", t => {
  let sch = new Schnorr("abcdeadddaaaaaaaaaaaa2322423333333333333333");
  let msg: string = "this is a random text that will be signed";
  let signature = sch.sign(msg);

  console.log("sig.r: " + signature.r);
  console.log("sig.s: " + signature.s);

  let signatureSBytes = hex(signature.s);
  let signatureRBytes = hex(signature.r);
  // convert to HBytes:
  let privateKeyBytes = hex(sch.key);
  console.log("hex privatekey: " + privateKeyBytes);
  let publicKeyBytes = hex(sch.publicKey);
  console.log("hex publicKeyBytes: " + publicKeyBytes);
  let signatureBytes = hex(signature);
  console.log(
    "hex signatureKeyBytes: r: " + signatureSBytes + " s: " + signatureRBytes
  );
  console.log(typeof signatureSBytes);

  // convert back to list of bytes
  const privateKeyFromBytes: Uint8Array = toHBytes(privateKeyBytes);
  const publicKeyFromBytes: Uint8Array = toHBytes(publicKeyBytes);
  const sigFromBytesS: Uint8Array = toHBytes(signatureSBytes);
  const sigFromBytesR: Uint8Array = toHBytes(signatureRBytes);

  t.is(
    sch.verify(msg, { s: sigFromBytesS, r: sigFromBytesR }, publicKeyFromBytes),
    true,
    "Schnorr signature should be correct!"
  );
});
