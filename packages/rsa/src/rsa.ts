/* tslint:disable variable-name no-conditional-assignment */

/** WIP AS PORTED FROM JS IMPL. */
import * as NodeRSA from "node-rsa";
import * as errors from "./errors";
import * as fs from "fs";

const KEY_LENGTH = 512;
const ENCODING = "base64";

/**
 *
 * @method generateKey
 *
 * @ignore
 *
 * @return {NodeRSA} generate RSA key object
 *
 **/

export function generateKey(): NodeRSA {
  return new NodeRSA({ b: KEY_LENGTH });
}

/**
 * Encrypts a message using a public key
 *
 * @method encrypt
 *
 * @ignore
 *
 * @param {string} message message to be encrypted
 * @param {NodeRSA} rsa RSA key object
 *
 **/

export function encrypt(message: string, rsa: NodeRSA): string {
  return rsa.encrypt(message, ENCODING);
}

/**
 * Decrypts a message using the private key
 *
 * @method decrypt
 *
 * @ignore
 * @param {string} hash hash to decrypt, that was generated with the corresponding pub key.
 * @param {NodeRSA} rsa RSA key object
 *
 **/
export function decrypt(hash: string, rsa: NodeRSA) {
  return rsa.decrypt(hash, "utf8");
}

/**
 * Imports key from file
 *
 * @method importKeyFiles
 *
 * @ignore
 *
 * @param {String} pubKeyPath path to pub key-file
 * @param {String} prvKeyPath path to prv key-file
 * @return
 **/

export function importKeyFiles(pubKeyPath: string, prvKeyPath: string) {
  let rsa: NodeRSA = generateKey();

  const pubKeyFile = fs.readFileSync(pubKeyPath, "utf-8");
  const prvKeyFile = fs.readFileSync(prvKeyPath, "utf-8");

  const pubKeyImport = rsa.importKey(pubKeyFile, "pkcs8-public");
  const prvKeyImport = rsa.importKey(prvKeyFile, "pkcs8-private");

  return {
    pub: pubKeyImport,
    prv: prvKeyImport,
    pubString: pubKeyFile,
    prvString: prvKeyFile
  };
}

/**
 * Exports a key
 *
 * @method generateKeyFiles
 *
 * @ignore
 *
 * @param {String} pubKeyPath Desired export path of the pub key.
 * @param {String} prvKeyPath Desired export path of the prv key.
 *
 **/

export function generateKeyFiles(pubKeyPath: string, prvKeyPath: string) {
  let rsa: NodeRSA = generateKey();

  const pubKeyExport = rsa.exportKey("pkcs8-public");
  const prvKeyExport = rsa.exportKey("pkcs8-private");

  const prvStream = fs.createWriteStream(prvKeyPath);
  const pubStream = fs.createWriteStream(pubKeyPath);

  prvStream.write(prvKeyExport);
  pubStream.write(pubKeyExport);

  return { pub: pubKeyExport, prv: prvKeyExport };
}
