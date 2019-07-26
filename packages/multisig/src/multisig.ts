import { addEntry, addHBytes, finalizeBundle } from "@helixnetwork/bundle";
import { removeChecksum } from "@helixnetwork/checksum";
import { txBits, txHex, hex, toTxBytes } from "@helixnetwork/converter";
import { Balances, createGetBalances } from "@helixnetwork/core";
import HHash from "@helixnetwork/hash-module";
import {
  digests,
  key,
  normalizedBundleHash,
  signatureFragment,
  subseed
} from "@helixnetwork/winternitz";
import * as Promise from "bluebird";
import * as errors from "../../errors";
import {
  arrayValidator,
  isAddress,
  isNinesHBytes,
  isSecurityLevel,
  remainderAddressValidator,
  transferValidator,
  validate,
  Validator
} from "../../guards";
import { Bundle, Callback, Provider, Transaction, Transfer } from "../../types";
import Address from "./address";
import {
  ADDRESS_BYTE_SIZE,
  NULL_TAG_HBYTES,
  SECURITY_LEVELS,
  SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE,
  SIGNATURE_SECRETE_KEY_BYTE_SIZE,
  SIGNATURE_TOTAL_BYTE_SIZE,
  TAG_BYTE_SIZE
} from "../../constants";

export { Bundle, Callback, Provider, Transaction, Transfer };

export interface MultisigInput {
  readonly address: string;
  readonly balance: number;
  readonly securitySum: number;
}

const HASH_FRAGMENT_BYTE = 16;

export const multisigInputValidator: Validator<MultisigInput> = (
  multisigInput: any
) => [
  multisigInput,
  ({ address, balance, securitySum }: MultisigInput) =>
    isSecurityLevel(securitySum) &&
    isAddress(address) &&
    Number.isInteger(balance) &&
    balance > 0,
  errors.INVALID_INPUT
];

export const sanitizeTransfers = (
  transfers: ReadonlyArray<Transfer>
): ReadonlyArray<Transfer> =>
  transfers.map(transfer => ({
    ...transfer,
    message: transfer.message || "",
    tag: transfer.tag || "",
    address: removeChecksum(transfer.address)
  }));

/* tslint:disable:variable-name */
export const createBundle = (
  input: MultisigInput,
  transfers: ReadonlyArray<Transfer>,
  remainderAddress?: string
): Bundle => {
  // Create a new bundle
  let bundle: Transaction[] = [];

  const signatureFragments: string[] = [];
  const totalBalance: number = input.balance;
  let totalValue = 0;
  let tag: string = NULL_TAG_HBYTES;

  //  Iterate over all transfers, get totalValue
  //  and prepare the signatureFragments, message and tag
  for (let i = 0; i < transfers.length; i++) {
    let signatureMessageLength = 1;

    // If message longer than 2187 txHex, increase signatureMessageLength (add multiple transactions)
    if (
      (transfers[i].message || "").length >
      SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE
    ) {
      // Get total length, message / maxLength (2187 txHex)
      signatureMessageLength += Math.floor(
        (transfers[i].message || "").length /
          SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE
      );

      let msgCopy = transfers[i].message;

      // While there is still a message, copy it
      while (msgCopy) {
        let fragment = msgCopy.slice(0, SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE);
        msgCopy = msgCopy.slice(
          SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE,
          msgCopy.length
        );

        // Pad remainder of fragment
        for (
          let j = 0;
          fragment.length < SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE;
          j++
        ) {
          fragment += "0";
        }

        signatureFragments.push(fragment);
      }
    } else {
      // Else, get single fragment with 2187 of 9's txHex
      let fragment = "";

      if (transfers[i].message) {
        fragment = (transfers[i].message || "").slice(
          0,
          SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE
        );
      }

      for (
        let j = 0;
        fragment.length < SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE;
        j++
      ) {
        fragment += "0";
      }

      signatureFragments.push(fragment);
    }

    // If no tag defined, get 27 tryte tag.
    tag = transfers[i].tag || NULL_TAG_HBYTES;

    // Pad for required 27 tryte length
    for (let j = 0; tag.length < TAG_BYTE_SIZE; j++) {
      tag += "0";
    }

    // Add first entries to the bundle
    // Slice the address in case the user provided a checksummed one
    const _bundle = addEntry(bundle, {
      length: signatureMessageLength,
      address: transfers[i].address.slice(0, ADDRESS_BYTE_SIZE),
      value: transfers[i].value,
      tag,
      timestamp: Math.floor(Date.now() / 1000)
    });

    bundle = _bundle.slice();

    // Sum up total value
    totalValue += transfers[i].value;
  }

  if (totalBalance > 0) {
    const toSubtract = 0 - totalBalance;

    // Add input as bundle entry
    // Only a single entry, signatures will be added later
    const _bundle = addEntry(bundle, {
      length: input.securitySum,
      address: input.address,
      value: toSubtract,
      tag,
      timestamp: Math.floor(Date.now() / 1000)
    });

    bundle = _bundle.slice();
  }

  if (totalValue > totalBalance) {
    throw new Error("Not enough balance.");
  }

  // If there is a remainder value
  // Add extra output to send remaining funds to
  if (totalBalance > totalValue) {
    const remainder = totalBalance - totalValue;

    // Remainder bundle entry if necessary
    if (!remainderAddress) {
      throw new Error("No remainder address defined");
    }

    const _bundle = addEntry(bundle, {
      length: 1,
      address: remainderAddress,
      value: remainder,
      tag,
      timestamp: Math.floor(Date.now() / 1000)
    });
    bundle = _bundle.slice();
  }

  return addHBytes(
    finalizeBundle(bundle),
    signatureFragments,
    bundle.findIndex(tx => tx.value < 0)
  );
};

/**
 * @class Multisig
 *
 * @memberof module:multisig
 */
export default class Multisig {
  public address = Address;
  private provider: Provider; // tslint:disable-line variable-name

  constructor(provider: Provider) {
    this.provider = provider;
  }

  /**
   * Gets the key value of a seed
   *
   * @member getKey
   *
   * @memberof Multisig
   *
   * @param {string} seed
   * @param {number} index
   * @param {number} security Security level to be used for the private key / address. Can be 1, 2 or 3
   *
   * @return {string} digest txHex
   */
  public getKey(seed: string, index: number, security: number) {
    return hex(key(subseed(toTxBytes(seed), index), security));
  }

  /**
   * Gets the digest value of a seed
   *
   * @member getDigest
   *
   * @memberof Multisig
   *
   * @param {string} seed
   * @param {number} index
   * @param {number} security Security level to be used for the private key / address. Can be 1, 2 or 3
   *
   * @return {string} digest txHex
   **/
  public getDigest(seed: string, index: number, security: number) {
    const keyBytes = key(subseed(toTxBytes(seed), index), security);

    return hex(digests(keyBytes));
  }

  /**
   * Validates  a generated multisig address
   *
   * @member validateAddress
   *
   * @memberof Multisig
   *
   * @param {string} multisigAddress
   * @param {array} digests
   *
   * @return {boolean}
   */
  public validateAddress(
    multisigAddress: string,
    digestsArr: ReadonlyArray<string>
  ) {
    const hHash = new HHash(HHash.HASH_ALGORITHM_1);

    hHash.initialize();

    // Absorb all key digests
    digestsArr.forEach(keyDigest => {
      const digesHBits = txBits(keyDigest);
      hHash.absorb(txBits(keyDigest), 0, digesHBits.length);
    });

    // Squeeze address txBits
    const addressHBits: Int8Array = new Int8Array(hHash.getHashLength());
    hHash.squeeze(addressHBits, 0, hHash.getHashLength());

    // Convert txBits into txHex and return the address
    return txHex(addressHBits) === multisigAddress;
  }

  /**
   * Prepares transfer by generating the bundle with the corresponding cosigner transactions
   * Does not contain signatures
   *
   * @member initiateTransfer
   *
   * @memberof Multisig
   *
   * @param {object} input the input addresses as well as the securitySum, and balance where:
   * - `address` is the input multisig address
   * - `securitySum` is the sum of security levels used by all co-signers
   * - `balance` is the expected balance, if you wish to override getBalances
   * @param {string} remainderAddress Has to be generated by the cosigners before initiating the transfer, can be null if fully spent
   * @param {object} transfers
   * @param {function} callback
   *
   * @return {array} Array of transaction objects
   */
  public initiateTransfer(
    input: MultisigInput,
    transfers: ReadonlyArray<Transfer>,
    remainderAddress?: string,
    callback?: Callback<Bundle>
  ): Promise<Bundle> {
    return Promise.resolve(
      validate(
        multisigInputValidator(input),
        arrayValidator<Transfer>(transferValidator)(transfers),
        !!remainderAddress && remainderAddressValidator(remainderAddress)
      )
    )
      .then(() => sanitizeTransfers(transfers))
      .then((sanitizedTransfers: ReadonlyArray<Transfer>) => {
        if (input.balance) {
          return createBundle(input, sanitizedTransfers, remainderAddress);
        } else {
          return createGetBalances(this.provider)([input.address], 100)
            .then((res: Balances): MultisigInput => ({
              ...input,
              balance: res.balances[0]
            }))
            .then((inputWithBalance: MultisigInput) =>
              createBundle(
                inputWithBalance,
                sanitizedTransfers,
                remainderAddress
              )
            );
        }
      })
      .asCallback(callback);
  }

  /**
   * Adds the cosigner signatures to the corresponding bundle transaction
   *
   * @member addSignature
   *
   * @memberof Multisig
   *
   * @param {array} bundleToSign
   * @param {string} inputAddress
   * @param keyHBytes
   * @param {function} callback
   *
   * @return {array} txHex Returns bundle txHex
   */
  public addSignature(
    bundleToSign: Bundle,
    inputAddress: string,
    keyHBytes: string,
    callback: Callback
  ) {
    const bundle = bundleToSign;
    const _bundle: Array<Partial<Transaction>> = [];

    // Get the security used for the private key
    // 1 security level = 2187 txHex
    const security = keyHBytes.length / SIGNATURE_SECRETE_KEY_BYTE_SIZE;

    // convert private key txHex into txBits
    const keyBytes = toTxBytes(keyHBytes);

    // First get the total number of already signed transactions
    // use that for the bundle hash calculation as well as knowing
    // where to add the signature
    let numSignedTxs = 0;

    for (let i = 0; i < bundle.length; i++) {
      if (bundle[i].address === inputAddress) {
        // If transaction is already signed, increase counter
        if (!isNinesHBytes(bundle[i].signatureMessageFragment as string)) {
          numSignedTxs++;
        } else {
          // Else sign the transaction
          const bundleHash = bundle[i].bundle;

          //  First 6561 txBits for the firstFragment
          const firstFragment = keyBytes.slice(0, SIGNATURE_TOTAL_BYTE_SIZE);

          //  Get the normalized bundle hash
          const normalizedBundle = normalizedBundleHash(toTxBytes(bundleHash)); // normalizedBundleHash(bundleHash as string);
          const normalizedBundleFragments = [];

          // Split hash into 3 fragments
          for (let k = 0; k < SECURITY_LEVELS; k++) {
            normalizedBundleFragments[k] = normalizedBundle.slice(
              k * HASH_FRAGMENT_BYTE,
              (k + 1) * HASH_FRAGMENT_BYTE
            );
          }

          //  First bundle fragment uses 27 txHex
          const firstBundleFragment =
            normalizedBundleFragments[numSignedTxs % SECURITY_LEVELS];

          //  Calculate the new signatureFragment with the first bundle fragment
          const firstSignedFragment = signatureFragment(
            firstBundleFragment,
            firstFragment
          );

          //  Convert signature to txHex and assign the new signatureFragment
          _bundle.push({
            signatureMessageFragment: txHex(firstSignedFragment)
          });
          for (let j = 1; j < security; j++) {
            const nextFragment = keyBytes.slice(
              SIGNATURE_SECRETE_KEY_BYTE_SIZE * j,
              (j + 1) * SIGNATURE_SECRETE_KEY_BYTE_SIZE
            );
            // is there any need to split the key basd on security levels?
            const nextBundleFragment =
              normalizedBundleFragments[(numSignedTxs + j) % SECURITY_LEVELS];
            //  Calculate the new signatureFragment with the first bundle fragment
            const nextSignedFragment = signatureFragment(
              nextBundleFragment,
              nextFragment
            );

            //  Convert signature to txHex and add new bundle entry at h + j position
            // Assign the signature fragment
            _bundle.push({
              signatureMessageFragment: hex(nextSignedFragment)
            });
            // }

            break;
          }
        }
      }
    }
    return callback(null, _bundle.slice());
  }
}

/**
 *   Multisig address constructor
 */
Multisig.prototype.address = Address;
