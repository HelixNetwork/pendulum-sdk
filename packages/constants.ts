/** We will provide sizes for this */

/**
 * Tryte has been converted into HByte
 * 1 HBytes is represented as a string with length 2, in hexadecimal representation,
 * because of this all values are multiplied with 2
 */

export const SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE = 2 * 64; // 2 * 1024; // 2187;
//public key for schnorr signature needs 33 byts
export const ADDRESS_BYTE_SIZE = 2 * 33; // trytes 81;
export const ADDRESS_BYTE_SIZE_PADDING = 2 * 36; // 33 is not multiple of 4
export const TRANSACTION_VALUE_BYTE_SIZE = 2 * 8; // trytes 27;
export const OBSOLETE_TAG_BYTE_SIZE = 2 * 8; // trytes 27
export const TRANSACTION_TIMESTAMP_BYTE_SIZE = 2 * 8; // trytes 9
export const TRANSACTION_CURRENT_INDEX_BYTE_SIZE = 2 * 8; // trytes 9
export const TRANSACTION_LAST_INDEX_BYTE_SIZE = 2 * 8; // trytes 9
export const HASH_BYTE_SIZE = 2 * 32; // trytes 81
export const TAG_BYTE_SIZE = 2 * 8; // trytes 27
export const TRANSACTION_TIMESTAMP_LOWER_BOUND_SIZE = 2 * 8; // trytes 9
export const TRANSACTION_TIMESTAMP_UPPER_BOUND_SIZE = 2 * 8; // trytes 9
export const NONCE_BYTE_SIZE = 2 * 8; // trytes 27

// Signature is reduced from 1024 to 64
// Address is incressed from 32 bytes to 33 -
// => 2 8 (1232 - (1024 - 64) + 1)
export const TRANSACTION_HBYTE_SIZE = 2 * 273; //2 * 1232; //2256 bytes?; // trytes 2673;
// Address checksum constants:
export const ADDRESS_CHECKSUM_BYTE_SIZE = 8; // 9 trytes
export const ADDRESS_MIN_CHECKSUM_BYTE_SIZE = 2; // 3 trytes

//HBITS constants
export const HASH_BITS_SIZE = 256; // trits 243
//export const ADDRESS_SIZE_BITS = 256; // trits 243
export const TRANSACTION_VALUE_BITS_SIZE = 64; // trits 81 -> 27 trytes -> 8 bytes -> 64 bits
export const TRANSACTION_TIMESTAMP_BITS_SIZE = 64; // trits 27 -> 9 trytes
export const TRANSACTION_CURRENT_INDEX_BITS_SIZE = 64; // trits 27
export const TRANSACTION_LAST_INDEX_BITS_SIZE = 64; // trits 27
export const TRANSACTION_OBSOLETE_TAG_BITS_SIZE = 64; // trits 81
//export const SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE_BITS = 8 * 1024; // trits 2187 -> 2187 trytes -> 1024 bytes -> 8 * 1024 bits

//Schnorr signature constants:
export const SIGNATURE_R_BYTE_SIZE = 32;
export const SIGNATURE_S_BYTE_SIZE = 32;
export const SIGNATURE_PUBLIC_KEY_BYTE_SIZE = 33;
export const SIGNATURE_SECRETE_KEY_BYTE_SIZE = 32;
export const SIGNATURE_TOTAL_BYTE_SIZE =
  SIGNATURE_R_BYTE_SIZE + SIGNATURE_S_BYTE_SIZE;

// Other constants:
export const SIGNATURE_FRAGMENT_NO = 32; // previous 27
export const MAX_INDEX_DIFF = 1000; // previous 1000

// Empty initialization:
export const NULL_ADDRESS_HBYTES = "0".repeat(ADDRESS_BYTE_SIZE);
export const NULL_HASH_HBYTES = "0".repeat(HASH_BYTE_SIZE);
export const NULL_TAG_HBYTES = "0".repeat(TAG_BYTE_SIZE);
export const NULL_NONCE_HBYTES = "0".repeat(NONCE_BYTE_SIZE);
export const NULL_SIGNATURE_MESSAGE_FRAGMENT_HBYTES = "0".repeat(
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE
);
export const NULL_TRANSACTION_HBYTES = "0".repeat(TRANSACTION_HBYTE_SIZE);
