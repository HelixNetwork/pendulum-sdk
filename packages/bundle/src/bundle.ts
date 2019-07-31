/** @module bundle */

import { txBits, txHex, hex, toTxBytes, value } from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import {
  padTxBits,
  padTxHex,
  padObsoleteTag,
  padSignedTxBits,
  padTag
} from "@helixnetwork/pad";
// import {add, normalizedBundleHash} from "@helixnetwork/winternitz/out/winternitz/src";
import { add, normalizedBundleHash } from "@helixnetwork/winternitz";
import {
  BYTE_SIZE_USED_FOR_VALIDATION_WITH_PADDING,
  NULL_HASH_TX_HEX,
  NULL_NONCE_TX_HEX,
  NULL_SIGNATURE_MESSAGE_FRAGMENT_TX_HEX,
  NULL_TAG_TX_HEX,
  SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE,
  TRANSACTION_CURRENT_INDEX_BITS_SIZE,
  TRANSACTION_LAST_INDEX_BITS_SIZE,
  TRANSACTION_OBSOLETE_TAG_BITS_SIZE,
  TRANSACTION_TIMESTAMP_BITS_SIZE,
  TRANSACTION_VALUE_BITS_SIZE
} from "../../constants";
import { Bundle, Hash, TxHex, Transaction } from "../../types";

export interface BundleEntry {
  readonly length: number;
  readonly address: Hash;
  readonly value: number;
  readonly tag: string;
  readonly timestamp: number;
  readonly signatureMessageFragments: ReadonlyArray<TxHex>;
}

export { Transaction, Bundle };

export const getEntryWithDefaults = (
  entry: Partial<BundleEntry>
): BundleEntry => ({
  length: entry.length || 1,
  address: entry.address || NULL_HASH_TX_HEX,
  value: entry.value || 0,
  tag: entry.tag || NULL_TAG_TX_HEX,
  timestamp: entry.timestamp || Math.floor(Date.now() / 1000),
  signatureMessageFragments: entry.signatureMessageFragments
    ? entry.signatureMessageFragments.map(
        padTxHex(SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE)
      )
    : Array(entry.length || 1).fill(NULL_SIGNATURE_MESSAGE_FRAGMENT_TX_HEX)
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
 * @param {number} [entry.value = 0] - Value to transfer in _HLX_
 * @param {string[]} [entry.signatureMessageFragments] - Array of signature message fragments transactionStrings, defaults to all-0s
 * @param {number} [entry.timestamp] - Transaction timestamp, defaults to `Math.floor(Date.now() / 1000)`
 * @param {string} [entry.tag] - Optional Tag, defaults to null tag (all-0s)
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
  const obsoleteTag = padObsoleteTag(entryWithDefaults.tag);

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
          trunkTransaction: NULL_HASH_TX_HEX,
          branchTransaction: NULL_HASH_TX_HEX,
          attachmentTimestamp: 0,
          attachmentTimestampLowerBound: 0,
          attachmentTimestampUpperBound: 0,
          bundle: NULL_HASH_TX_HEX,
          nonce: NULL_NONCE_TX_HEX,
          hash: NULL_HASH_TX_HEX
        }))
    );
};

/**
 * Adds a list of transactionStrings in the bundle starting at offset
 *
 * @method addTxHex
 *
 * @param {Transaction[]} transactions - Transactions in the bundle
 *
 * @param {TxHex[]} fragments - Message signature fragments to add
 *
 * @param {number} [offset=0] - Optional offset to start appending signature message fragments
 *
 * @return {Transaction[]} Transactions of finalized bundle
 */
export const addTxHex = (
  transactions: Bundle,
  fragments: ReadonlyArray<TxHex>,
  offset = 0
): Bundle =>
  transactions.map(
    (transaction, i) =>
      i >= offset && i < offset + fragments.length
        ? {
            ...transaction,
            signatureMessageFragment: padTxHex(
              SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE
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
  const valueHBits = transactions.map(tx => txBits(tx.value));

  const timestampHBits = transactions.map(tx => txBits(tx.timestamp));

  const currentIndexHBits = transactions.map(tx => txBits(tx.currentIndex));

  const lastIndexHBits = txBits(transactions[0].lastIndex);

  const obsoleteTagHBits = transactions
    .map(tx => txBits(tx.obsoleteTag))
    .map(padTxBits(TRANSACTION_OBSOLETE_TAG_BITS_SIZE));

  let bundleHash: Hash = "";
  let validBundle: boolean = false;

  while (!validBundle) {
    const hHash = new HHash(HHash.HASH_ALGORITHM_1);
    hHash.initialize();

    for (let i = 0; i < transactions.length; i++) {
      const essence = toTxBytes(
        padTxHex(BYTE_SIZE_USED_FOR_VALIDATION_WITH_PADDING)(
          transactions[i].address +
            txHex(valueHBits[i]) +
            txHex(obsoleteTagHBits[i]) +
            txHex(timestampHBits[i]) +
            txHex(currentIndexHBits[i]) +
            txHex(lastIndexHBits)
        )
      );
      hHash.absorb(essence, 0, essence.length);
    }

    const bundleHashTxHex = new Int8Array(hHash.getHashLength());
    hHash.squeeze(bundleHashTxHex, 0, hHash.getHashLength());
    bundleHash = hex(bundleHashTxHex);
    if (
      normalizedBundleHash(Uint8Array.from(bundleHashTxHex)).indexOf(15) !== -1
    ) {
      // Insecure bundle, increment obsoleteTag and recompute bundle hash
      obsoleteTagHBits[0] = padTxBits(TRANSACTION_OBSOLETE_TAG_BITS_SIZE)(
        txBits(value(obsoleteTagHBits[0]) + 1)
      );
    } else {
      validBundle = true;
    }
  }

  return transactions.map((transaction, i) => ({
    ...transaction,
    // overwrite obsoleteTag in first entry
    obsoleteTag: i === 0 ? txHex(obsoleteTagHBits[0]) : transaction.obsoleteTag,
    bundle: bundleHash
  }));
};
