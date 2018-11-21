import HHash from "@helix/hash-module";
import HSign from "./hsign";

const elliptic = require("bcrypto/vendor/elliptic");
const BN = require("bcrypto/lib/bn.js");
const secp256k1 = require("bcrypto/lib/secp256k1");
const Schn = require("schnorr");

export default class Schnorr {
  public curve = elliptic.ec("secp256k1").curve;

  public secreteKey: Uint8Array;
  public publicKey: Uint8Array;
  public signature: any;

  constructor(seed: string) {
    this.secreteKey = this.computePrivateKey(seed);
    this.publicKey = Schnorr.computePublicKey(this.secreteKey);
  }

  public computePrivateKey(seed: string): Uint8Array {
    const hHash = new HHash(HHash.HASH_ALGORITHM_3);
    hHash.initialize();
    hHash.absorb(seed, 0, hHash.getHashLength());
    const hashBytes: Int8Array = new Int8Array(hHash.getHashLength());
    hHash.squeeze(hashBytes, 0, hHash.getHashLength());
    let privateKey: any = new BN(hashBytes);
    while (!this.validateBN(privateKey)) {
      hHash.squeeze(hashBytes, 0, hHash.getHashLength());
      privateKey = new BN(hashBytes);
    }
    return privateKey.toArrayLike(Buffer, "be");
  }

  private validateBN(bigNumber: any) {
    return !(bigNumber.isZero() || bigNumber.gte(this.curve.n));
  }

  public static computePublicKey(privateKey: any) {
    return secp256k1.publicKeyCreate(privateKey, true);
  }

  public static aggregatePublicKey(publicKeys: Array<Uint8Array>) {
    return Schn.combineKeys(publicKeys);
  }

  public static aggregateSignature(publicKeys: Array<HSign>) {
    let signature = Schn.combineSigs(publicKeys.map(k => k.getSignature()));
    let r = new BN(signature.r).toArrayLike(Buffer, "be");
    let s = new BN(signature.s).toArrayLike(Buffer, "be");
    return new HSign(r, s);
  }

  public static sign(message: string, secreteKey: Uint8Array): HSign {
    let signature = Schn.sign(Buffer.from(message), secreteKey);
    let r = new BN(signature.r).toArrayLike(Buffer, "be");
    let s = new BN(signature.s).toArrayLike(Buffer, "be");
    return new HSign(r, s);
  }

  public static partialSign(
    message: string,
    secreteKey: Uint8Array,
    privateNonce: Uint8Array,
    publicNonce: Uint8Array
  ): HSign {
    let signature = Schn.partialSign(
      Buffer.from(message),
      secreteKey,
      privateNonce,
      publicNonce
    );
    let r = new BN(signature.r).toArrayLike(Buffer, "be");
    let s = new BN(signature.s).toArrayLike(Buffer, "be");
    return new HSign(r, s);
  }

  public static verify(
    message: string,
    signature: HSign,
    pubKey: Uint8Array
  ): boolean {
    return Schn.verify(Buffer.from(message), signature.getSignature(), pubKey);
  }

  public generateNoncePair(message: string, secreteKey: Uint8Array, data: any) {
    const drbg = Schn.drbg(
      Buffer.from(message),
      Buffer.from(secreteKey),
      Buffer.from(data)
    );
    const len = this.curve.n.byteLength();

    let k = null;

    for (;;) {
      k = new BN(drbg.generate(len));

      if (k.isZero()) continue;

      if (k.gte(this.curve.n)) continue;
      break;
    }

    return {
      k: k,
      buff: Buffer.from(this.curve.g.mul(k).encode("array", true))
    };
  }
}
