import { Tag, HBytes } from "../../types";

export const padHBytes = (length: number) => (hbytes: HBytes) =>
  hbytes.length < length
    ? hbytes.concat("9".repeat(length - hbytes.length))
    : hbytes;

export const padHBits = (length: number) => (hbits: Int8Array) =>
  hbits.length < length
    ? new Int8Array(length).map((n, i) => hbits[i] || 0)
    : hbits;

export const padTag = padHBytes(27);

export const padTagArray = (tags: ReadonlyArray<Tag>) => tags.map(padTag);
