/* tslint:disable variable-name no-conditional-assignment */

/** PORTED FROM JS IMPL. This class is still incomplete wip, please use with caution. */
import { decrypt, encrypt, importKeyFiles } from "@helixnetwork/rsa";
import * as ipfsClient from "ipfs-http-client";

/**
 * @class Ipfs
 * @ignore
 */

export default class Ipfs {
  public ipfs: ipfsClient;

  /**
   * @constructor
   * @param {string} ip IP Address of the IPFS provider.
   * @param {string} port Port of the IPFS provider.
   * @ignore
   *
   **/
  constructor(ip: string, port: string) {
    this.ipfs = ipfsClient(ip, port, { protocol: "http" });
  }

  /**
   * Publish (encrypted) message(s) to IPFS node.
   *
   * @method publishMessage
   * @param {string} message Message to be published.
   * @param {string} pathToPubKey Path to the public key you wish to use for encrypting the message.
   * @param {boolean} toEncrypt Whether to encrypt the message using your public key.
   * @ignore
   *
   **/
  public publishMessage(
    message: string,
    pathToPubKey: string,
    toEncrypt: boolean
  ) {
    const m = toEncrypt
      ? encrypt(message, importKeyFiles(pathToPubKey, "").pub)
      : message;
    const buffer = this.ipfs.types.Buffer.from(message);
    this.ipfs.add(buffer).then(res => {
      // console.log("Hash: " + res[0].hash);
    });
  }

  /**
   * Publish (encrypted) File(s) to IPFS node.
   *
   * @method publishFiles
   * @param {string} path Path of the files to be published.
   * @param {boolean} toEncrypt Whether to encrypt the files(s) using your public key.
   * @ignore
   *
   **/
  public publishFiles(path: string, toEncrypt: boolean) {
    this.ipfs
      .addFromFs(path, { recursive: true, ignore: ["subdir/to/ignore/**"] })
      .then(res => {
        // console.log("Hash: " + res[0].hash);
      });
  }

  /**
   * Pull (encrypted) message(s) from IPFS node.
   *
   * @method pullMessage
   * @param {string} cid Content ID of the file to be pulled.
   * @param {string?} pathToPrvKey Path to the private key used for decrypting.
   * @param {boolean?} isEncrypted Whether the message(s) to be pulled are encrypted.
   * @ignore
   *
   **/
  public pullMessage(cid: string, pathToPrvKey: string, isEncrypted: boolean) {
    this.ipfs.get(cid).then(files => {
      files.forEach(file => {
        const data = file.content.toString("utf-8");
        const res = isEncrypted
          ? decrypt(data, importKeyFiles("", pathToPrvKey).prv)
          : data;
        // console.log(res);
      });
    });
  }

  /**
   * Pull (encrypted) file(s) from IPFS node.
   *
   * @method pullFiles
   * @param {string} cid Content ID of the file(s) to be pulled.
   * @param {string?} pathToPrvKey Path to the private key used for decrypting.
   * @param {boolean?} isEncrypted Whether the file(s) to be pulled are encrypted.
   * @ignore
   *
   **/
  public pullFiles(cid: string, pathToPrvKey: string, isEncrypted: boolean) {
    this.ipfs.get(cid).then(files => {
      files.forEach(file => {
        const data = file.toString();
        const res = isEncrypted
          ? decrypt(data, importKeyFiles("", pathToPrvKey).prv)
          : data;
        // console.log(res);
      });
    });
  }
}
