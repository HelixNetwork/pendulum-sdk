/**
 * Tryte has been converted into HByte
 * 1 HBytes is represented as a string with length 2, in hexadecimal representation,
 * because of this all values are multiplied with 2
 */

export const SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE = 2 * 512;
export const ADDRESS_BYTE_SIZE = 2 * 32;
export const ADDRESS_BYTE_SIZE_PADDING = 2 * 32;
export const TRANSACTION_VALUE_BYTE_SIZE = 2 * 8;
export const OBSOLETE_TAG_BYTE_SIZE = 2 * 32;
export const TRANSACTION_TIMESTAMP_BYTE_SIZE = 2 * 8;
export const TRANSACTION_CURRENT_INDEX_BYTE_SIZE = 2 * 8;
export const TRANSACTION_LAST_INDEX_BYTE_SIZE = 2 * 8;
export const HASH_HBYTE_SIZE = 2 * 32;
export const HASH_BYTE_SIZE = 32;

export const TAG_BYTE_SIZE = 2 * 8;
export const TRANSACTION_TIMESTAMP_LOWER_BOUND_SIZE = 2 * 8;
export const TRANSACTION_TIMESTAMP_UPPER_BOUND_SIZE = 2 * 8;
export const NONCE_BYTE_SIZE = 2 * 8;
export const SEED_BYTE_SIZE = 2 * 32;
export const PAD_BYTE_SIZE = 2 * 24;

export const BYTE_SIZE_USED_FOR_VALIDATION =
  ADDRESS_BYTE_SIZE +
  TRANSACTION_VALUE_BYTE_SIZE +
  TRANSACTION_LAST_INDEX_BYTE_SIZE +
  TRANSACTION_TIMESTAMP_BYTE_SIZE +
  TRANSACTION_CURRENT_INDEX_BYTE_SIZE +
  OBSOLETE_TAG_BYTE_SIZE; // previous 162

export const BYTE_SIZE_USED_FOR_VALIDATION_WITH_PADDING = BYTE_SIZE_USED_FOR_VALIDATION; // padded to a multiple of 4
// signature size security level 1
export const TRANSACTION_HBYTE_SIZE = 2 * 768;
// Address checksum constants:
export const ADDRESS_CHECKSUM_BYTE_SIZE = 8;
export const ADDRESS_MIN_CHECKSUM_BYTE_SIZE = 2;

// HBITS constants
export const HASH_BITS_SIZE = 256;
// export const ADDRESS_SIZE_BITS = 256;
export const TRANSACTION_VALUE_BITS_SIZE = 64;
export const TRANSACTION_TIMESTAMP_BITS_SIZE = 64;
export const TRANSACTION_CURRENT_INDEX_BITS_SIZE = 64;
export const TRANSACTION_LAST_INDEX_BITS_SIZE = 64;
export const TRANSACTION_OBSOLETE_TAG_BITS_SIZE = 256;
export const TRANSACTION_TAG_BITS_SIZE = 64;
// export const SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE_BITS = 8 * 1024; // trits 2187 -> 2187 trytes -> 1024 bytes -> 8 * 1024 bits

// Schnorr signature constants:
export const SIGNATURE_R_BYTE_SIZE = 32;
export const SIGNATURE_S_BYTE_SIZE = 32;
export const SIGNATURE_PUBLIC_KEY_BYTE_SIZE = 32;
export const SIGNATURE_SECRETE_KEY_BYTE_SIZE = 512;
export const SIGNATURE_TOTAL_BYTE_SIZE = 512;
//SIGNATURE_R_BYTE_SIZE + SIGNATURE_S_BYTE_SIZE;

// Other constants:
export const SIGNATURE_FRAGMENT_NO = 16; // 32; // previous 27
export const MAX_INDEX_DIFF = 1000; // previous 1000

// Empty initialization:
export const NULL_ADDRESS_HBYTES = "0".repeat(ADDRESS_BYTE_SIZE);
export const NULL_HASH_HBYTES = "0".repeat(HASH_HBYTE_SIZE);
export const NULL_TAG_HBYTES = "0".repeat(TAG_BYTE_SIZE);
export const NULL_NONCE_HBYTES = "0".repeat(NONCE_BYTE_SIZE);
export const NULL_SIGNATURE_MESSAGE_FRAGMENT_HBYTES = "0".repeat(
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE
);
export const NULL_TRANSACTION_HBYTES = "0".repeat(TRANSACTION_HBYTE_SIZE);
export const SECURITY_LEVELS = 4;
