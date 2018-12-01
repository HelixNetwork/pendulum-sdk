import HHash from "@helix/hash-module";
import HSign from "./hsign";
import * as errors from "./errors";
import { hex } from "@helix/converter";
import {
  SIGNATURE_R_BYTE_SIZE,
  SIGNATURE_SECRETE_KEY_BYTE_SIZE,
  SIGNATURE_PUBLIC_KEY_BYTE_SIZE,
  SIGNATURE_S_BYTE_SIZE
} from "../../constants";
import { isEmptyBytes } from "../../guards";

const elliptic = require("bcrypto/vendor/elliptic");
const BN = require("bcrypto/lib/bn.js");
const secp256k1 = require("bcrypto/lib/secp256k1");
const Schn = require("schnorr");

export default class Schnorr {
  public static curve = elliptic.ec("secp256k1").curve;

  public secreteKey: Uint8Array;
  public publicKey: Uint8Array;

  constructor(seed: string | Int8Array | Uint8Array) {
    this.secreteKey = Schnorr.computeSecreteKey(seed);
    this.publicKey = Schnorr.computePublicKey(this.secreteKey);
    if (this.secreteKey.length != SIGNATURE_SECRETE_KEY_BYTE_SIZE) {
      throw new Error(
        errors.ILLEGAL_SECRET_KEY_LENGTH_SCH + " " + this.secreteKey.length
      );
    }
    if (this.publicKey.length != SIGNATURE_PUBLIC_KEY_BYTE_SIZE) {
      throw new Error(
        errors.ILLEGAL_PUBLIC_KEY_LENGTH_SCH + " " + this.publicKey.length
      );
    }
  }

  public static computeSecreteKey(
    seed: string | Int8Array | Uint8Array
  ): Uint8Array {
    const hHash = new HHash(HHash.HASH_ALGORITHM_3);
    hHash.initialize();
    hHash.absorb(seed, 0, hHash.getHashLength());
    const hashBytes: Int8Array = new Int8Array(hHash.getHashLength());
    hHash.squeeze(hashBytes, 0, hHash.getHashLength());
    let privateKey: any = new BN(hashBytes);
    let buffer;
    while (
      !Schnorr.validateBN(privateKey) ||
      privateKey.toArrayLike(Buffer, "be").length !=
        SIGNATURE_SECRETE_KEY_BYTE_SIZE
    ) {
      hHash.squeeze(hashBytes, 0, hHash.getHashLength());
      privateKey = new BN(hashBytes);
    }

    return privateKey.toArrayLike(Buffer, "be");
  }

  private static validateBN(bigNumber: any) {
    return !(bigNumber.isZero() && bigNumber.gte(Schnorr.curve.n));
  }

  private static isValidPoint(point: any) {
    return Schnorr.curve.decodePoint(point) != null;
  }

  public static computePublicKey(privateKey: Uint8Array) {
    if (
      privateKey == null ||
      privateKey.length != SIGNATURE_SECRETE_KEY_BYTE_SIZE
    ) {
      throw new Error(errors.ILLEGAL_SECRET_KEY_LENGTH_SCH + privateKey.length);
    }
    const buffer = Buffer.alloc(privateKey.length);
    for (let i = 0; i < privateKey.length; i++) {
      buffer[i] = privateKey[i];
    }
    return secp256k1.publicKeyCreate(buffer, true);
  }

  public static aggregatePublicKey(publicKeys: Array<Uint8Array>) {
    return Schn.combineKeys(publicKeys);
  }

  public static aggregatePublicNonces(nonces: Array<Uint8Array>) {
    const agg = Schn.combineKeys(nonces);
    if (Schnorr.curve.decodePoint(agg).y.odd) {
      return null;
    }
    return agg;
  }

  public static aggregateSignature(signs: Array<HSign>) {
    let signature = Schn.combineSigs(signs.map(k => k.getSignature()));
    let r = new BN(signature.r).toArrayLike(Buffer, "be");
    let s = new BN(signature.s).toArrayLike(Buffer, "be");
    return new HSign(r, s);
  }

  public static sign(message: string, secreteKey: Uint8Array): HSign {
    let msg;
    if (typeof message === "string") {
      msg = Buffer.from(message);
    } else {
      msg = message;
    }
    let signature = Schn.sign(msg, secreteKey);
    let r = new BN(signature.r).toArrayLike(Buffer, "be");
    let s = new BN(signature.s).toArrayLike(Buffer, "be");
    if (r.length != SIGNATURE_R_BYTE_SIZE) {
      throw new Error(errors.ILLEGAL_R_IN_SIGNATURE + " " + r.length);
    }
    if (s.length != SIGNATURE_S_BYTE_SIZE) {
      throw new Error(errors.ILLEGAL_S_IN_SIGNATURE + " " + s.length);
    }
    return new HSign(r, s);
  }

  public static partialSign(
    message: Int8Array | Uint8Array | string,
    secreteKey: Uint8Array,
    privateNonce: Uint8Array,
    publicNonce: Uint8Array
  ): HSign {
    let msg;
    if (typeof message === "string") {
      msg = Buffer.from(message);
    } else {
      msg = message;
    }
    let signature = Schn.partialSign(
      msg,
      secreteKey,
      privateNonce,
      publicNonce
    );
    let r = new BN(signature.r).toArrayLike(Buffer, "be");
    let s = new BN(signature.s).toArrayLike(Buffer, "be");

    return new HSign(r, s);
  }

  public static verify(
    message: Int8Array | Uint8Array | string,
    signature: HSign,
    pubKey: Uint8Array
  ): boolean {
    try {
      if (!Schnorr.isValidSiganture(signature)) {
        console.warn(errors.ILLEGAL_SIGNATURE_CONTENT);
        return false;
      }
      if (!Schnorr.isValidPoint(pubKey)) {
        console.warn(errors.ILLEGAL_PUBLIC_KEY_CONTENT);
        return false;
      }
      //console.log('schnorr - sign ' + message + ' ' + hex(signature.getSignatureArray()));
      if (typeof message === "string") {
        return Schn.verify(
          Buffer.from(message),
          signature.getSignature(),
          pubKey
        );
      }
      return Schn.verify(message, signature.getSignature(), pubKey);
    } catch {
      return false;
    }
  }

  private static isValidSiganture(signature: HSign): boolean {
    if (isEmptyBytes(signature.r) || isEmptyBytes(signature.s)) {
      return false;
    }
    try {
      return Schnorr.curve.pointFromX(new BN(signature.r), false) != null;
    } catch {
      return false;
    }
  }

  public static generateNoncePair(
    message: Uint8Array | Int8Array | string,
    secreteKey: Uint8Array,
    data: string
  ) {
    let msg: string = "";
    if (typeof message === "string") {
      msg = message;
    } else {
      msg = hex(message);
    }

    let dt = data != null && data.length > 32 ? data.slice(0, 32) : data;
    const drbg = Schn.drbg(
      Buffer.from(msg),
      Buffer.from(secreteKey),
      Buffer.from(dt)
    );
    const len = Schnorr.curve.n.byteLength();

    let k = null;

    for (;;) {
      k = new BN(drbg.generate(len));

      if (k.isZero()) continue;

      if (k.gte(Schnorr.curve.n)) continue;
      break;
    }
    return {
      k: k.toArrayLike(Buffer, "be"),
      buff: Buffer.from(Schnorr.curve.g.mul(k).encode("array", true))
    };
  }
}
