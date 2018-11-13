import test from "ava";
import {
  addEntry,
  addHBytes,
  createBundle,
  finalizeBundle
} from "../src/bundle";
import {
  ADDRESS_BYTE_SIZE,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE,
  HASH_BYTE_SIZE,
  NULL_HASH_HBYTES,
  NULL_NONCE_HBYTES
} from "../../constants";

const NULL_HASH = NULL_HASH_HBYTES;
const NULL_NONCE = NULL_NONCE_HBYTES;
const addresses = [
  "A".repeat(ADDRESS_BYTE_SIZE),
  "B".repeat(ADDRESS_BYTE_SIZE)
];
const tag = "TAG" + "9".repeat(24);

const bundle = [
  {
    address: addresses[0],
    value: -2,
    tag,
    obsoleteTag: tag,
    currentIndex: 0,
    lastIndex: 2,
    timestamp: 1522219,
    signatureMessageFragment: "9".repeat(SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE),
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
    obsoleteTag: tag,
    currentIndex: 1,
    lastIndex: 2,
    timestamp: 1522219,
    signatureMessageFragment: "9".repeat(SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE),
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
    obsoleteTag: tag,
    currentIndex: 2,
    lastIndex: 2,
    timestamp: 1522219,
    signatureMessageFragment: "9".repeat(SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE),
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
        tag: "TAG",
        timestamp: 1522219
      },
      {
        length: 1,
        address: addresses[1],
        value: 2,
        tag: "TAG",
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
      tag: "TAG",
      timestamp: 1522219
    }),
    bundle,
    "addEntry() should add new entry and return correct trasnactions."
  );
});

test("addHBytes() adds hbytes and returns correct transactions.", t => {
  t.deepEqual(
    addHBytes(bundle, ["HBYTES", "HBYTES", "HBYTES"]),
    bundle.map(transaction => ({
      ...transaction,
      signatureMessageFragment:
        "HBYTES" + "9".repeat(SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE - 6)
    })),
    "addEntry should add hbytes and return correct transactions."
  );
});

test("finalizeBundle() adds correct bundle hash.", t => {
  const bundleHash =
    "VRGXKZDODWIVGFYFCCXJRNDCQJVYUVBRIWJXKFGBIEWUPHHTJLTKH99JW9OLJ9JCIXCEIRRXJKLWOBDZZ";
  const incrObsoleteTag = "ZUH".concat("9".repeat(24));

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
