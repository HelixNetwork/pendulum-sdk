import { Tag, HBytes } from "../../types";

export const padHBytes = (length: number) => (hbytes: HBytes) =>
  hbytes.length < length
    ? hbytes.concat("9".repeat(length - hbytes.length))
    : hbytes;

export const padTrits = (length: number) => (trits: Int8Array) =>
  trits.length < length
    ? new Int8Array(length).map((n, i) => trits[i] || 0)
    : trits;

export const padTag = padHBytes(27);

export const padTagArray = (tags: ReadonlyArray<Tag>) => tags.map(padTag);
