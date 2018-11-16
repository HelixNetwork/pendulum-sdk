import { Tag, HBytes } from "../../types";
import { TAG_BYTE_SIZE } from "../../constants";

export const padHBytes = (length: number) => (hbytes: HBytes) =>
  hbytes.length < length
    ? hbytes.concat("0".repeat(length - hbytes.length))
    : hbytes;

export const padHBits = (length: number) => (hbits: Int8Array) =>
  hbits.length < length
    ? new Int8Array(length).map((n, i) => hbits[i] || 0)
    : hbits;

export const padTag = padHBytes(TAG_BYTE_SIZE);

export const padTagArray = (tags: ReadonlyArray<Tag>) => tags.map(padTag);
