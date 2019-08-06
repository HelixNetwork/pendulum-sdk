import { OBSOLETE_TAG_HEX_SIZE, TAG_HEX_SIZE } from "../../constants";
import { TxHex, Tag } from "../../types";

export const padTxHex = (length: number) => (txs: TxHex) =>
  txs.length < length ? txs.concat("0".repeat(length - txs.length)) : txs;

export const padTxBits = (length: number) => (txBits: Int8Array) =>
  txBits.length < length
    ? new Int8Array(length).map(
        (n, i) =>
          i >= length - txBits.length ? txBits[i - (length - txBits.length)] : 0
      )
    : txBits;

export const padSignedTxBits = (length: number) => (txBits: Int8Array) =>
  txBits.length < length
    ? new Int8Array(length).map(
        (n, i) =>
          i < txBits.length ? txBits[i] || 0 : txBits[txBits.length - 1]
      )
    : txBits;

export const padTag = padTxHex(TAG_HEX_SIZE);
export const padObsoleteTag = padTxHex(OBSOLETE_TAG_HEX_SIZE);

export const padByteArray = (length: number) => (bytes: Uint8Array) =>
  bytes.length < length
    ? new Uint8Array(length).map((n, i) => bytes[i] || 0)
    : bytes;

export const padTagArray = (tags: ReadonlyArray<Tag>) => tags.map(padTag);
