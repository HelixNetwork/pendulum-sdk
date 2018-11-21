//import * as Schn from 'schnorr';
//import {elliptic} from 'bcrypto/vendor/elliptic';
//import * as Signature from 'schnorr/bcrypto/vendor/elliptic/lib/elliptic/ec/signature';
//import {BN} from 'bcrypto/lib/bn.js';
//import {secp256k1} from 'bcrypto/lib/secp256k1';
//import SHA256 from "../../sha256/src";
import HHash from "@helix/hash-module";

const elliptic = require("bcrypto/vendor/elliptic");
//const Signature = require('schnorr/bcrypto/vendor/elliptic/lib/elliptic/ec/signature');
const BN = require("bcrypto/lib/bn.js");
const secp256k1 = require("bcrypto/lib/secp256k1");
//const hash256 = require('bcrypto/lib/hash256');
const Schn = require("schnorr");

export default class Schnorr {
  public curve = elliptic.ec("secp256k1").curve;

  public key: Uint8Array;
  public publicKey: Uint8Array;
  public signature: any;

  constructor(seed: string) {
    this.key = this.getPrivateKey(seed);
    this.publicKey = Schnorr.computePublicKey(this.key);
  }

  public getPrivateKey(seed: string): Uint8Array {
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
    //  return secp256k1.privateKeyGenerate(); //
    return privateKey.toArrayLike(Buffer, "be");
  }

  private validateBN(bigNumber: any) {
    return !(bigNumber.isZero() || bigNumber.gte(this.curve.n));
  }

  public static computePublicKey(privateKey: any) {
    return secp256k1.publicKeyCreate(privateKey, true);
  }

  public sign(message: string): any {
    console.log(message);
    console.log(this.key);
    let signature = Schn.sign(Buffer.from(message), this.key);
    console.log("signature object " + signature + " " + typeof signature);
    //  console.log('signature[0]: ' + signature[0]);
    // console.log('buffer signature[0]: ' + Buffer.from(signature[0]));
    let r = new BN(signature.r).toArrayLike(Buffer, "be");
    let s = new BN(signature.s).toArrayLike(Buffer, "be");

    return { r, s };
  }

  public verify(message: string, signature: any, pubKey: Uint8Array): boolean {
    console.log(
      "--------------schnorr message: " + message + " typeof " + typeof message
    );
    const bla: string = message;
    console.log("signature: " + signature + " typeof: " + typeof signature);
    return Schn.verify(Buffer.from(message), signature, pubKey);
  }
}
