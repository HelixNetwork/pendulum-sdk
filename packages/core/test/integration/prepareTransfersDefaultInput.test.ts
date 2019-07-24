import { addChecksum } from "@helixnetwork/checksum";
import { createHttpClient } from "@helixnetwork/http-client";
import { hbytesLevel1 as expected } from "@helixnetwork/samples";
import test from "ava";
import { HBytes, Transfer } from "../../../types";
import { createPrepareTransfers } from "../../src";
import "./nocks/prepareTransfersDefaultInput";

const transfers: ReadonlyArray<Transfer> = [
  {
    address: addChecksum("a".repeat(2 * 32)),
    value: 3,
    tag: "aaaa",
    message: "0"
  },
  {
    address: addChecksum("b".repeat(2 * 32)),
    value: 3,
    tag: "aaaa"
  }
];

const zeroValueTransfer: ReadonlyArray<Transfer> = [
  {
    address: "0".repeat(2 * 32),
    value: 0,
    message: "aa",
    tag: "0000000000000000"
  }
];
const expectedZeroValueHBytes: ReadonlyArray<HBytes> = [
  "aa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000173a2b000000000000000000000000000000004653c8a4e65d04528cc351314963773e0d9e322725a0479b29787534c02c6e760000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
];
const now = () => 1522219924;
const prepareTransfers = createPrepareTransfers(undefined, now, "lib");
const prepareTransfersWithNetwork = createPrepareTransfers(
  createHttpClient(),
  now,
  "lib"
);

test("prepareTransfers() with network prepares the correct array of hbytes.", async t => {
  const hbytes = await prepareTransfersWithNetwork("abcd", transfers);
  t.deepEqual(
    hbytes,
    expected,
    "prepareTranfers() should prepare the correct array of hbytes."
  );
});
test("prepareTransfer() prepares correct hbytes for zero value transfers", async t => {
  const zeroValueHBytes = await prepareTransfersWithNetwork(
    "abcd",
    zeroValueTransfer
  );
  t.deepEqual(
    zeroValueHBytes,
    expectedZeroValueHBytes,
    "prepareTransfers() should prepare the correct hbytes for zero value transfers"
  );
});

test("prepareTransfers() throws intuitive error when provided invalid transfers array", async t => {
  const invalidTransfer = {
    address: addChecksum("a".repeat(2 * 32)),
    value: 3
  } as any;

  t.is(
    t.throws(() => prepareTransfers("abcd", invalidTransfer)).message,
    `Invalid transfer array: ${invalidTransfer}`,
    "prepareTransfers() should throw intuitive error when provided invalid transfers array"
  );
});
