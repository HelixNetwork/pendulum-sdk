import { OBSOLETE_TAG_BYTE_SIZE, TAG_BYTE_SIZE } from "../../constants";
import { HBytes, Tag } from "../../types";

export const padHBytes = (length: number) => (txHex: HBytes) =>
  txHex.length < length
    ? txHex.concat("0".repeat(length - txHex.length))
    : txHex;

export const padHBits = (length: number) => (txBits: Int8Array) =>
  txBits.length < length
    ? new Int8Array(length).map(
        (n, i) =>
          i >= length - txBits.length ? txBits[i - (length - txBits.length)] : 0
      )
    : txBits;

export const padSignedHBits = (length: number) => (txBits: Int8Array) =>
  txBits.length < length
    ? new Int8Array(length).map(
        (n, i) =>
          i < txBits.length ? txBits[i] || 0 : txBits[txBits.length - 1]
      )
    : txBits;

export const padTag = padHBytes(TAG_BYTE_SIZE);
export const padObsoleteTag = padHBytes(OBSOLETE_TAG_BYTE_SIZE);

export const padByteArray = (length: number) => (bytes: Uint8Array) =>
  bytes.length < length
    ? new Uint8Array(length).map((n, i) => bytes[i] || 0)
    : bytes;

export const padTagArray = (tags: ReadonlyArray<Tag>) => tags.map(padTag);
