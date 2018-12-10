import test from "ava";
import {
  ADDRESS_BYTE_SIZE,
  HASH_BYTE_SIZE,
  NULL_HASH_HBYTES,
  NULL_NONCE_HBYTES,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE
} from "../../constants";
import {
  addEntry,
  addHBytes,
  createBundle,
  finalizeBundle
} from "../src/bundle";

const NULL_HASH = NULL_HASH_HBYTES;
const NULL_NONCE = NULL_NONCE_HBYTES;
const addresses = [
  "a".repeat(ADDRESS_BYTE_SIZE),
  "b".repeat(ADDRESS_BYTE_SIZE)
];
const tag = "aaaa" + "0".repeat(12);

const bundle = [
  {
    address: addresses[0],
    value: -2,
    tag,
    obsoleteTag: tag,
    currentIndex: 0,
    lastIndex: 2,
    timestamp: 1522219,
    signatureMessageFragment: "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE),
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
    signatureMessageFragment: "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE),
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
    signatureMessageFragment: "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE),
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

test("addHBytes() adds hbytes and returns correct transactions.", t => {
  t.deepEqual(
    addHBytes(bundle, ["abcdef", "abcdef", "abcdef"]),
    bundle.map(transaction => ({
      ...transaction,
      signatureMessageFragment:
        "abcdef" + "0".repeat(SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE - 6)
    })),
    "addEntry should add hbytes and return correct transactions."
  );
});

test("finalizeBundle() adds correct bundle hash.", t => {
  const bundleHash =
    "8ecb441f877543ddc097f720b479e06420df6e595be5fe2d9955a78fcf551f58";
  const incrObsoleteTag = "aaaa".concat("0".repeat(12));
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
