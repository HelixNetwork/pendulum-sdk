import test from "ava";
import Schnorr from "../src/schnorr";
import { hex, toHBytes } from "@helix/converter";

test("Signing test schnorr signature with HByte conversion!", t => {
  let sch = new Schnorr("abcdeadddaaaaaaaaaaaa2322423333333333333333");
  let msg: string = "this is a random text that will be signed";
  let signature = Schnorr.sign(msg, sch.secreteKey);

  let signatureSBytes = hex(signature.s);
  let signatureRBytes = hex(signature.r);
  // convert to HBytes:
  let privateKeyBytes = hex(sch.secreteKey);
  let publicKeyBytes = hex(sch.publicKey);

  // convert back to list of bytes
  const privateKeyFromBytes: Uint8Array = toHBytes(privateKeyBytes);
  const publicKeyFromBytes: Uint8Array = toHBytes(publicKeyBytes);
  const sigFromBytesS: Uint8Array = toHBytes(signatureSBytes);
  const sigFromBytesR: Uint8Array = toHBytes(signatureRBytes);

  t.is(
    Schnorr.verify(msg, signature, publicKeyFromBytes),
    true,
    "Schnorr signature should be correct!"
  );
});

test("Signing aggregation with schnorr!", t => {
  let msg: string = "this is a random text that will be signed";

  const sch1 = new Schnorr("abcdeadddaaaaaaaaaaaa2322423333333333333333");
  const sch2 = new Schnorr("thisisanotherseedjustfortest12345544");

  const noncePair1 = Schnorr.generateNoncePair(
    msg,
    sch1.secreteKey,
    "thisisjustarandomstringasdfasdfs"
  );
  const noncePair2 = Schnorr.generateNoncePair(
    msg,
    sch2.secreteKey,
    "thisisjustarandomstringasdfasdfs"
  );

  let signature1 = Schnorr.partialSign(
    msg,
    sch1.secreteKey,
    noncePair1.k,
    noncePair2.buff
  );
  let signature2 = Schnorr.partialSign(
    msg,
    sch2.secreteKey,
    noncePair2.k,
    noncePair1.buff
  );

  const aggregatedPublicKey = Schnorr.aggregatePublicKey([
    sch1.publicKey,
    sch2.publicKey
  ]);
  const aggreatedSignature = Schnorr.aggregateSignature([
    signature1,
    signature2
  ]);

  t.is(
    Schnorr.verify(msg, aggreatedSignature, aggregatedPublicKey),
    true,
    "Schnorr signature should be correct!"
  );
});
