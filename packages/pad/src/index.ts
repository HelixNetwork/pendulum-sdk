import { OBSOLETE_TAG_BYTE_SIZE, TAG_BYTE_SIZE } from "../../constants";
import { HBytes, Tag } from "../../types";

export const padHBytes = (length: number) => (hbytes: HBytes) =>
  hbytes.length < length
    ? hbytes.concat("0".repeat(length - hbytes.length))
    : hbytes;

export const padHBits = (length: number) => (hbits: Int8Array) =>
  hbits.length < length
    ? new Int8Array(length).map(
        (n, i) =>
          i >= length - hbits.length ? hbits[i - (length - hbits.length)] : 0
      )
    : hbits;

export const padSignedHBits = (length: number) => (hbits: Int8Array) =>
  hbits.length < length
    ? new Int8Array(length).map(
        (n, i) => (i < hbits.length ? hbits[i] || 0 : hbits[hbits.length - 1])
      )
    : hbits;

export const padTag = padHBytes(TAG_BYTE_SIZE);
export const padObsoleteTag = padHBytes(OBSOLETE_TAG_BYTE_SIZE);

export const padByteArray = (length: number) => (bytes: Uint8Array) =>
  bytes.length < length
    ? new Uint8Array(length).map((n, i) => bytes[i] || 0)
    : bytes;

export const padTagArray = (tags: ReadonlyArray<Tag>) => tags.map(padTag);
