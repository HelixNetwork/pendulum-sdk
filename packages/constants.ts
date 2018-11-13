/** We will provide sizes for this */

export const HASH_BYTE_SIZE = 81;
export const TAG_BYTE_SIZE = 27;
export const SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE = 2187;
export const TRANSACTION_HBYTE_SIZE = 2673;

export const MAX_INDEX_DIFF = 1000;

export const NULL_HASH_HBYTES = "9".repeat(HASH_BYTE_SIZE);
export const NULL_TAG_HBYTES = "9".repeat(TAG_BYTE_SIZE);
export const NULL_SIGNATURE_MESSAGE_FRAGMENT_HBYTES = "9".repeat(
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE
);
export const NULL_TRANSACTION_HBYTES = "9".repeat(TRANSACTION_HBYTE_SIZE);
