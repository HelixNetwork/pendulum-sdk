import test from "ava";
import {
  ADDRESS_BYTE_SIZE,
  HASH_TX_HEX_SIZE,
  NULL_HASH_TX_HEX,
  NULL_NONCE_TX_HEX,
  SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE
} from "../../constants";
import {
  addEntry,
  addTxHex,
  createBundle,
  finalizeBundle
} from "../src/bundle";

const NULL_HASH = NULL_HASH_TX_HEX;
const NULL_NONCE = NULL_NONCE_TX_HEX;
const addresses = [
  "a".repeat(ADDRESS_BYTE_SIZE),
  "b".repeat(ADDRESS_BYTE_SIZE)
];
const tag = "aaaa" + "0".repeat(12);
const obsoleteTag = "aaaa" + "0".repeat(60);

const bundle = [
  {
    address: addresses[0],
    value: -2,
    tag,
    obsoleteTag,
    currentIndex: 0,
    lastIndex: 2,
    timestamp: 1522219,
    signatureMessageFragment: "0".repeat(
      SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE
    ),
    trunkTransaction: NULL_HASH,
    branchTransaction: NULL_HASH,
    attachmentTimestamp: 0,
    attachmentTimestampLowerBound: 0,
    attachmentTimestampUpperBound: 0,
    bundle: NULL_HASH,
    nonce: NULL_NONCE,
    hash: NULL_HASH
  },
  {
    address: addresses[0],
    value: 0,
    tag,
    obsoleteTag,
    currentIndex: 1,
    lastIndex: 2,
    timestamp: 1522219,
    signatureMessageFragment: "0".repeat(
      SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE
    ),
    trunkTransaction: NULL_HASH,
    branchTransaction: NULL_HASH,
    attachmentTimestamp: 0,
    attachmentTimestampLowerBound: 0,
    attachmentTimestampUpperBound: 0,
    bundle: NULL_HASH,
    nonce: NULL_NONCE,
    hash: NULL_HASH
  },
  {
    address: addresses[1],
    value: 2,
    tag,
    obsoleteTag,
    currentIndex: 2,
    lastIndex: 2,
    timestamp: 1522219,
    signatureMessageFragment: "0".repeat(
      SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE
    ),
    trunkTransaction: NULL_HASH,
    branchTransaction: NULL_HASH,
    attachmentTimestamp: 0,
    attachmentTimestampLowerBound: 0,
    attachmentTimestampUpperBound: 0,
    bundle: NULL_HASH,
    nonce: NULL_NONCE,
    hash: NULL_HASH
  }
];

test("createBundle() returns correct transactions.", t => {
  t.deepEqual(
    createBundle([
      {
        length: 2,
        address: addresses[0],
        value: -2,
        tag: "aaaa",
        timestamp: 1522219
      },
      {
        length: 1,
        address: addresses[1],
        value: 2,
        tag: "aaaa",
        timestamp: 1522219
      }
    ]),
    bundle,
    "createBundle() should return correct transactions."
  );
});

test("addEntry() adds new entry and returns correct transactions.", t => {
  t.deepEqual(
    addEntry(bundle.slice(0, 2), {
      length: 1,
      address: addresses[1],
      value: 2,
      tag: "aaaa",
      timestamp: 1522219
    }),
    bundle,
    "addEntry() should add new entry and return correct trasnactions."
  );
});

test("addTxHex() adds transactionStrings and returns correct transactions.", t => {
  t.deepEqual(
    addTxHex(bundle, ["abcdef", "abcdef", "abcdef"]),
    bundle.map(transaction => ({
      ...transaction,
      signatureMessageFragment:
        "abcdef" + "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE - 6)
    })),
    "addEntry should add transactionStrings and return correct transactions."
  );
});

test("finalizeBundle() adds correct bundle hash.", t => {
  const bundleHash =
    "fccc0d39a7211124c94cd2223b78c4ab8852435e4da493020fe7eaeebc826ca1";
  const incrObsoleteTag =
    "000000000000000000000000000000000000000000000000000000000000001e";
  const expected = bundle.map((transaction, i) => ({
    ...transaction,
    obsoleteTag: i === 0 ? incrObsoleteTag : transaction.obsoleteTag,
    bundle: bundleHash
  }));
  t.deepEqual(
    finalizeBundle(bundle),
    expected,
    "finalizeBundle() should add correct bundle hash."
  );
});
