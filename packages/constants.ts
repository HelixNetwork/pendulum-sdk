/********************************************************************************
 *
 * Length for following constants is given for TxBytes (bytes)
 *
 *******************************************************************************/
export const SIGNATURE_MESSAGE_FRAGMENT_BYTE_SIZE = 512;
export const ADDRESS_BYTE_SIZE = 32;
export const ADDRESS_BYTE_SIZE_PADDING = 32;
export const TRANSACTION_VALUE_BYTE_SIZE = 8;
export const OBSOLETE_TAG_BYTE_SIZE = 32;
export const TRANSACTION_TIMESTAMP_BYTE_SIZE = 8;
export const TRANSACTION_CURRENT_INDEX_BYTE_SIZE = 8;
export const TRANSACTION_LAST_INDEX_BYTE_SIZE = 8;
export const HASH_TX_BYTE_SIZE = 32;
export const TAG_BYTE_SIZE = 8;
export const TRANSACTION_TIMESTAMP_LOWER_BOUND_BYTE_SIZE = 8;
export const TRANSACTION_TIMESTAMP_UPPER_BOUND_BYTE_SIZE = 8;
export const NONCE_BYTE_BYTE_SIZE = 8;
export const SEED_BYTE_SIZE = 32;
export const PAD_BYTE_SIZE = 24;
export const HASH_BYTE_SIZE = 32;
export const TRANSACTION_TX_BYTE_SIZE = 768;
export const ADDRESS_CHECKSUM_BYTE_SIZE = 4;
export const ADDRESS_MIN_CHECKSUM_BYTE_SIZE = 1;

/********************************************************************************
 *
 * Length in TxHex (is 2 * lenght in bytes), TxHex represents a hexadecimal string
 *
 *******************************************************************************/
export const SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE =
  2 * SIGNATURE_MESSAGE_FRAGMENT_BYTE_SIZE;
export const ADDRESS_HEX_SIZE = 2 * ADDRESS_BYTE_SIZE;
export const ADDRESS_HEX_SIZE_PADDING = 2 * ADDRESS_BYTE_SIZE_PADDING;
export const TRANSACTION_VALUE_HEX_SIZE = 2 * TRANSACTION_VALUE_BYTE_SIZE;
export const OBSOLETE_TAG_HEX_SIZE = 2 * OBSOLETE_TAG_BYTE_SIZE;
export const TRANSACTION_TIMESTAMP_HEX_SIZE =
  2 * TRANSACTION_TIMESTAMP_BYTE_SIZE;
export const TRANSACTION_CURRENT_INDEX_HEX_SIZE =
  2 * TRANSACTION_CURRENT_INDEX_BYTE_SIZE;
export const TRANSACTION_LAST_INDEX_HEX_SIZE =
  2 * TRANSACTION_LAST_INDEX_BYTE_SIZE;
export const HASH_TX_HEX_SIZE = 2 * HASH_TX_BYTE_SIZE;
export const TAG_HEX_SIZE = 2 * TAG_BYTE_SIZE;
export const TRANSACTION_TIMESTAMP_LOWER_BOUND_HEX_SIZE =
  2 * TRANSACTION_TIMESTAMP_LOWER_BOUND_BYTE_SIZE;
export const TRANSACTION_TIMESTAMP_UPPER_BOUND_HEX_SIZE =
  2 * TRANSACTION_TIMESTAMP_UPPER_BOUND_BYTE_SIZE;
export const NONCE_BYTE_HEX_SIZE = 2 * NONCE_BYTE_BYTE_SIZE;
export const SEED_HEX_SIZE = 2 * SEED_BYTE_SIZE;
export const PAD_HEX_SIZE = 2 * PAD_BYTE_SIZE;

export const HEX_SIZE_FOR_TXHEX_USED_FOR_VALIDATION =
  ADDRESS_HEX_SIZE +
  TRANSACTION_VALUE_HEX_SIZE +
  TRANSACTION_LAST_INDEX_HEX_SIZE +
  TRANSACTION_TIMESTAMP_HEX_SIZE +
  TRANSACTION_CURRENT_INDEX_HEX_SIZE +
  OBSOLETE_TAG_HEX_SIZE;

export const HEX_SIZE_FOR_TXHEX_USED_FOR_VALIDATION_WITH_PADDING = HEX_SIZE_FOR_TXHEX_USED_FOR_VALIDATION; // padded to a multiple of 4
// signature size security level 1
export const TRANSACTION_TX_HEX_SIZE = 2 * TRANSACTION_TX_BYTE_SIZE;
// Address checksum constants:
export const ADDRESS_CHECKSUM_HEX_SIZE = 2 * ADDRESS_CHECKSUM_BYTE_SIZE;
export const ADDRESS_MIN_CHECKSUM_HEX_SIZE = 2 * ADDRESS_MIN_CHECKSUM_BYTE_SIZE;

// Empty initialization:
export const NULL_ADDRESS_TX_HEX = "0".repeat(ADDRESS_HEX_SIZE);
export const NULL_HASH_TX_HEX = "0".repeat(HASH_TX_HEX_SIZE);
export const NULL_TAG_TX_HEX = "0".repeat(TAG_HEX_SIZE);
export const NULL_NONCE_TX_HEX = "0".repeat(NONCE_BYTE_HEX_SIZE);
export const NULL_SIGNATURE_MESSAGE_FRAGMENT_TX_HEX = "0".repeat(
  SIGNATURE_MESSAGE_FRAGMENT_HEX_SIZE
);
export const NULL_TRANSACTION_TX_HEX = "0".repeat(TRANSACTION_TX_HEX_SIZE);

/********************************************************************************
 *
 * Length in TxBits (is 2 * lenght in bytes), TxBits represents an array of bits
 *
 *******************************************************************************/
export const HASH_BITS_SIZE = 8 * HASH_BYTE_SIZE;
export const TRANSACTION_VALUE_BITS_SIZE = 8 * TRANSACTION_VALUE_BYTE_SIZE;
export const TRANSACTION_TIMESTAMP_BITS_SIZE =
  8 * TRANSACTION_TIMESTAMP_BYTE_SIZE;
export const TRANSACTION_CURRENT_INDEX_BITS_SIZE =
  8 * TRANSACTION_CURRENT_INDEX_BYTE_SIZE;
export const TRANSACTION_LAST_INDEX_BITS_SIZE =
  8 * TRANSACTION_LAST_INDEX_BYTE_SIZE;
export const TRANSACTION_OBSOLETE_TAG_BITS_SIZE = 8 * OBSOLETE_TAG_BYTE_SIZE;
export const TRANSACTION_TAG_BITS_SIZE = 8 * TAG_BYTE_SIZE;

/********************************************************************************
 *
 * Other constants:
 *
 *******************************************************************************/
export const SIGNATURE_FRAGMENT_NO = 16;
export const MAX_INDEX_DIFF = 1000;
export const SECURITY_LEVELS = 4;

export const DEFAULT_SECURITY_LEVEL = 1;
export const DEFAULT_SECURITY_LEVEL_PREPARE_TRANSFER = DEFAULT_SECURITY_LEVEL;
export const DEFAULT_SECURITY_LEVEL_TRANSFER_OPTIONS = 2;
export const DEFAULT_SECURITY_LEVEL_INPUT_OPTIONS = 2;
export const DEFAULT_SECURITY_LEVEL_GET_ACCOUNT = 2;

/********************************************************************************
 * Transaction fields offsets for TxBytes:
 *******************************************************************************/
export const START_INDEX_SIGNATURE_MESSAGE_BYTE = 0;

export const START_INDEX_ADDRESS_BYTE =
  START_INDEX_SIGNATURE_MESSAGE_BYTE + SIGNATURE_MESSAGE_FRAGMENT_BYTE_SIZE;
export const START_INDEX_VALUE_BYTE =
  START_INDEX_ADDRESS_BYTE + ADDRESS_BYTE_SIZE;
export const START_INDEX_OBSOLETE_TAG_BYTE =
  START_INDEX_VALUE_BYTE + TRANSACTION_VALUE_BYTE_SIZE;
export const START_INDEX_TIMESTAMP_BYTE =
  START_INDEX_OBSOLETE_TAG_BYTE + OBSOLETE_TAG_BYTE_SIZE;
export const START_INDEX_CURRENT_INDEX_BYTE =
  START_INDEX_TIMESTAMP_BYTE + TRANSACTION_TIMESTAMP_BYTE_SIZE;
export const START_INDEX_LAST_INDEX_BYTE =
  START_INDEX_CURRENT_INDEX_BYTE + TRANSACTION_CURRENT_INDEX_BYTE_SIZE;
export const START_INDEX_BUNDLE_BYTE =
  START_INDEX_LAST_INDEX_BYTE + TRANSACTION_LAST_INDEX_BYTE_SIZE;
export const START_TRUNK_TRANS_BYTE =
  START_INDEX_BUNDLE_BYTE + HASH_TX_BYTE_SIZE;
export const START_BRANCH_TRANS_BYTE =
  START_TRUNK_TRANS_BYTE + HASH_TX_BYTE_SIZE;
export const START_INDEX_TAG_BYTE = START_BRANCH_TRANS_BYTE + HASH_TX_BYTE_SIZE;
export const START_INDEX_ATTACHED_TIMESTAMP_BYTE =
  START_INDEX_TAG_BYTE + TAG_BYTE_SIZE;
export const START_INDEX_TIMESTAMP_LOW_BYTE =
  START_INDEX_ATTACHED_TIMESTAMP_BYTE + TRANSACTION_TIMESTAMP_BYTE_SIZE;
export const START_INDEX_TIMESTAMP_UP_BYTE =
  START_INDEX_TIMESTAMP_LOW_BYTE + TRANSACTION_TIMESTAMP_LOWER_BOUND_BYTE_SIZE;
export const START_INDEX_NONCE_BYTE =
  START_INDEX_TIMESTAMP_UP_BYTE + TRANSACTION_TIMESTAMP_UPPER_BOUND_BYTE_SIZE;

/********************************************************************************
 * Transaction fields offsets for HEX:
 *******************************************************************************/
export const START_INDEX_SIGNATURE_MESSAGE_HEX =
  2 * START_INDEX_SIGNATURE_MESSAGE_BYTE;
export const START_INDEX_ADDRESS_HEX = 2 * START_INDEX_ADDRESS_BYTE;
export const START_INDEX_VALUE_HEX = 2 * START_INDEX_VALUE_BYTE;
export const START_INDEX_OBSOLETE_TAG_HEX = 2 * START_INDEX_OBSOLETE_TAG_BYTE;
export const START_INDEX_TIMESTAMP_HEX = 2 * START_INDEX_TIMESTAMP_BYTE;
export const START_INDEX_CURRENT_INDEX_HEX = 2 * START_INDEX_CURRENT_INDEX_BYTE;
export const START_INDEX_LAST_INDEX_HEX = 2 * START_INDEX_LAST_INDEX_BYTE;
export const START_INDEX_BUNDLE_HEX = 2 * START_INDEX_BUNDLE_BYTE;
export const START_TRUNK_TRANS_HEX = 2 * START_TRUNK_TRANS_BYTE;
export const START_BRANCH_TRANS_HEX = 2 * START_BRANCH_TRANS_BYTE;
export const START_INDEX_TAG_HEX = 2 * START_INDEX_TAG_BYTE;
export const START_INDEX_ATTACHED_TIMESTAMP_HEX =
  2 * START_INDEX_ATTACHED_TIMESTAMP_BYTE;
export const START_INDEX_TIMESTAMP_LOW_HEX = 2 * START_INDEX_TIMESTAMP_LOW_BYTE;
export const START_INDEX_TIMESTAMP_UP_HEX = 2 * START_INDEX_TIMESTAMP_UP_BYTE;
export const START_INDEX_NONCE_HEX = 2 * START_INDEX_NONCE_BYTE;

/********************************************************************************
 *
 * Schnorr singature constants:
 *
 *******************************************************************************/
export const SIGNATURE_R_BYTE_SIZE = 32;
export const SIGNATURE_S_BYTE_SIZE = 32;
export const SIGNATURE_PUBLIC_KEY_BYTE_SIZE = 32;
export const SIGNATURE_SECRETE_KEY_BYTE_SIZE = 512;
export const SIGNATURE_TOTAL_BYTE_SIZE = 512;
