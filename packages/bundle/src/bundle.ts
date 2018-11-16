/** @module bundle */

import { hbits, hbytes, hex } from "@helix/converter";
import HHash from "@helix/hash-module";
import { padTag, padHBits, padHBytes } from "@helix/pad";
import { add, normalizedBundleHash } from "@helix/signing";
import { Hash, Bundle, Transaction, HBytes } from "../../types";
import {
  HASH_BYTE_SIZE,
  NULL_HASH_HBYTES,
  NULL_NONCE_HBYTES,
  NULL_SIGNATURE_MESSAGE_FRAGMENT_HBYTES,
  NULL_TAG_HBYTES,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE,
  SIGNATURE_FRAGMENT_NO,
  TRANSACTION_CURRENT_INDEX_BITS_SIZE,
  TRANSACTION_LAST_INDEX_BITS_SIZE,
  TRANSACTION_TIMESTAMP_BITS_SIZE,
  TRANSACTION_VALUE_BITS_SIZE,
  TRANSACTION_OBSOLETE_TAG_BITS_SIZE
} from "../../constants";

//const NULL_HASH_HBYTES = "9".repeat(HASH_BYTE_SIZE);
// const NULL_TAG_HBYTES = "9".repeat(27);
// const NULL_NONCE_HBYTES = "9".repeat(27);
// const NULL_SIGNATURE_MESSAGE_FRAGMENT_HBYTES = "9".repeat(2187);

export interface BundleEntry {
  readonly length: number;
  readonly address: Hash;
  readonly value: number;
  readonly tag: string;
  readonly timestamp: number;
  readonly signatureMessageFragments: ReadonlyArray<HBytes>;
}

export const getEntryWithDefaults = (
  entry: Partial<BundleEntry>
): BundleEntry => ({
  length: entry.length || 1,
  address: entry.address || NULL_HASH_HBYTES,
  value: entry.value || 0,
  tag: entry.tag || NULL_TAG_HBYTES,
  timestamp: entry.timestamp || Math.floor(Date.now() / 1000),
  signatureMessageFragments: entry.signatureMessageFragments
    ? entry.signatureMessageFragments.map(
        padHBytes(SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE)
      )
    : Array(entry.length || 1).fill(NULL_SIGNATURE_MESSAGE_FRAGMENT_HBYTES)
});

/**
 * Creates a bunlde with given transaction entries.
 *
 * @method createBundle
 *
 * @param {BundleEntry[]} entries - Entries of signle or multiple transactions with the same address
 *
 * @return {Transaction[]} List of transactions in the bundle
 */
export const createBundle = (
  entries: ReadonlyArray<Partial<BundleEntry>> = []
): Bundle =>
  entries.reduce((bundle: Bundle, entry) => addEntry(bundle, entry), []);

/**
 * Creates a bunlde with given transaction entries
 *
 * @method addEntry
 *
 * @param {Transaction[]} transactions - List of transactions currently in the bundle
 *
 * @param {object} entry - Entry of single or multiple transactions with the same address
 * @param {number} [entry.length=1] - Entry length, which indicates how many transactions in the bundle will occupy
 * @param {string} [entry.address] - Address, defaults to all-9s
 * @param {number} [entry.value = 0] - Value to transfer in _IOTAs_
 * @param {string[]} [entry.signatureMessageFragments] - Array of signature message fragments hbytes, defaults to all-9s
 * @param {number} [entry.timestamp] - Transaction timestamp, defaults to `Math.floor(Date.now() / 1000)`
 * @param {string} [entry.tag] - Optional Tag, defaults to null tag (all-9s)
 *
 * @return {Transaction[]} Bundle
 */
export const addEntry = (
  transactions: Bundle,
  entry: Partial<BundleEntry>
): Bundle => {
  const entryWithDefaults = getEntryWithDefaults(entry);
  const {
    length,
    address,
    value,
    timestamp,
    signatureMessageFragments
  } = entryWithDefaults;
  const lastIndex = transactions.length - 1 + length;
  const tag = padTag(entryWithDefaults.tag);
  const obsoleteTag = tag;

  return transactions
    .map(transaction => ({ ...transaction, lastIndex }))
    .concat(
      Array(length)
        .fill(null)
        .map((_, i) => ({
          address,
          value: i === 0 ? value : 0,
          tag,
          obsoleteTag,
          currentIndex: transactions.length + i,
          lastIndex,
          timestamp,
          signatureMessageFragment: signatureMessageFragments[i],
          trunkTransaction: NULL_HASH_HBYTES,
          branchTransaction: NULL_HASH_HBYTES,
          attachmentTimestamp: 0,
          attachmentTimestampLowerBound: 0,
          attachmentTimestampUpperBound: 0,
          bundle: NULL_HASH_HBYTES,
          nonce: NULL_NONCE_HBYTES,
          hash: NULL_HASH_HBYTES
        }))
    );
};

/**
 * Adds a list of hbytes in the bundle starting at offset
 *
 * @method addHBytes
 *
 * @param {Transaction[]} transactions - Transactions in the bundle
 *
 * @param {HBytes[]} fragments - Message signature fragments to add
 *
 * @param {number} [offset=0] - Optional offset to start appending signature message fragments
 *
 * @return {Transaction[]} Transactions of finalized bundle
 */
export const addHBytes = (
  transactions: Bundle,
  fragments: ReadonlyArray<HBytes>,
  offset = 0
): Bundle =>
  transactions.map(
    (transaction, i) =>
      i >= offset && i < offset + fragments.length
        ? {
            ...transaction,
            signatureMessageFragment: padHBytes(
              32 * HASH_BYTE_SIZE // todo check this 32 expected to be SIGNATURE_FRAGMENT_NO
            )(fragments[i - offset] || "")
          }
        : transaction
  );

/**
 * Finalizes the bundle by calculating the bundle hash
 *
 * @method finalizeBundle
 *
 * @param {Transaction[]} transactions - Transactions in the bundle
 *
 * @return {Transaction[]} Transactions of finalized bundle
 */
export const finalizeBundle = (transactions: Bundle): Bundle => {
  const valueHBits = transactions
    .map(tx => hbits(tx.value))
    .map(padHBits(TRANSACTION_VALUE_BITS_SIZE));

  const timestampHBits = transactions
    .map(tx => hbits(tx.timestamp))
    .map(padHBits(TRANSACTION_TIMESTAMP_BITS_SIZE));

  const currentIndexHBits = transactions
    .map(tx => hbits(tx.currentIndex))
    .map(padHBits(TRANSACTION_CURRENT_INDEX_BITS_SIZE));

  const lastIndexHBits = padHBits(TRANSACTION_LAST_INDEX_BITS_SIZE)(
    hbits(transactions[0].lastIndex)
  );

  const obsoleteTagHBits = transactions
    .map(tx => hbits(tx.obsoleteTag))
    .map(padHBits(TRANSACTION_OBSOLETE_TAG_BITS_SIZE));

  let bundleHash: Hash;
  let validBundle: boolean = false;

  while (!validBundle) {
    const hHash = new HHash(HHash.HASH_ALGORITHM_1);
    hHash.initialize();

    for (let i = 0; i < transactions.length; i++) {
      const essence = hbits(
        transactions[i].address +
          hbytes(valueHBits[i]) +
          hbytes(obsoleteTagHBits[i]) +
          hbytes(timestampHBits[i]) +
          hbytes(currentIndexHBits[i]) +
          hbytes(lastIndexHBits)
      );
      hHash.absorb(essence, 0, essence.length);
    }

    const bundleHashHBytes = new Int8Array(hHash.getHashLength());
    hHash.squeeze(bundleHashHBytes, 0, hHash.getHashLength());
    bundleHash = hex(bundleHashHBytes);

    if (normalizedBundleHash(bundleHash).indexOf(8) !== -1) {
      // Insecure bundle, increment obsoleteTag and recompute bundle hash
      obsoleteTagHBits[0] = add(obsoleteTagHBits[0], new Int8Array(1).fill(1));
    } else {
      validBundle = true;
    }
  }

  return transactions.map((transaction, i) => ({
    ...transaction,
    // overwrite obsoleteTag in first entry
    obsoleteTag:
      i === 0 ? hbytes(obsoleteTagHBits[0]) : transaction.obsoleteTag,
    bundle: bundleHash
  }));
};
