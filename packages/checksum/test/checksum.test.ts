import {
  addresses,
  addressesWithChecksum,
  addressWithChecksum,
  addressWithInvalidChecksum
} from "@helixnetwork/samples";
import test from "ava";
import { ADDRESS_BYTE_SIZE } from "../../constants";
import { addChecksum, errors, isValidChecksum, removeChecksum } from "../src";

const invalidAddress =
  "62633132333334343532333432333432333261616161616363616333453454334543";
test("addChecksum() adds 8-hbytes checksum", t => {
  t.is(
    addChecksum(addresses[0]),
    addressesWithChecksum[0],
    "addChecksum() should add 8-hbytes checksum to the end of address."
  );
  t.deepEqual(
    addChecksum(addresses.slice(0, 1)),
    addressesWithChecksum.slice(0, 1),
    "addChecksum() should add 8-hbytes checksum to the end of each address in a given array."
  );
});

test("addChecksum() returns the exact address, if was passed with checksum", t => {
  t.is(
    addChecksum(addressesWithChecksum[0]),
    addressesWithChecksum[0],
    "addChecksum() should return the exact address, if was passed with checksum."
  );
});

test("addChecksum() throws error for invalid addresses", t => {
  const error = t.throws(
    () => addChecksum(invalidAddress),
    Error,
    "addChecksum() should throw error if address is invalid."
  );

  t.is(
    error.message,
    errors.INVALID_ADDRESS,
    "addChecksum() should throw correct error message."
  );
});

test("addChecksum() does not mutate the original array", t => {
  const arr = [
    ...addresses.slice(0, 1).map(a => a.slice(0, ADDRESS_BYTE_SIZE))
  ];

  addChecksum(arr);

  t.deepEqual(
    arr,
    addresses.slice(0, 1),
    "addChecksum() should not mutate the original array."
  );
});

test("addChecksum() adds checksum of arbitrary length", t => {
  const hbytes = "0".repeat(ADDRESS_BYTE_SIZE);
  const hbytesWithChecksum = hbytes + "ddbf";

  t.is(
    addChecksum(hbytes, 4, false),
    hbytesWithChecksum,
    "addChecsum() should add checksum of arbitrary length."
  );
});

test("isValidChecksum() correctly validates the checksum", t => {
  t.is(
    isValidChecksum(addressWithInvalidChecksum),
    false,
    "isValidChecksum() should return false for address with invalid checksum."
  );

  t.is(
    isValidChecksum(addresses[0]),
    false,
    "isValidChecksum() should return false for address without checksum."
  );
});

test("isValidChecksum() throws error for invalid address", t => {
  const error = t.throws(
    () => isValidChecksum(invalidAddress),
    Error,
    "isValidChecksum() should throw error if invalid address was passed."
  );

  t.is(
    error.message,
    errors.INVALID_ADDRESS,
    "isValidChecksum() should throw correct error message."
  );
});

test("removeChecksum() removes checksum from addresses with checksum", t => {
  t.deepEqual(
    removeChecksum(addressesWithChecksum.slice(0, 1)),
    addresses.slice(0, 1),
    "removeChecksum() should remove checksum from address with checksum."
  );

  t.deepEqual(
    removeChecksum(addressesWithChecksum.slice(0, 1)),
    addresses.slice(0, 1),
    "removeChecksum() should remove checksum from each address with checksum in given array."
  );
});

test("removeChecksum() returns the exact address, if was passed without checksum", t => {
  t.deepEqual(
    removeChecksum(addresses),
    addresses,
    "removeChecksum() should return the exact address if was passed without checksum."
  );
});

test("removeChecksum() does not mutate the original array", t => {
  const arr = [addressWithChecksum];

  removeChecksum(arr);

  t.deepEqual(
    arr,
    [addressWithChecksum],
    "removeChecksum() should not mutate the original array."
  );
});

test("removeChecksum() throws error for invalid addresses", t => {
  const error = t.throws(
    () => removeChecksum(invalidAddress),
    Error,
    "removeChecksum() should throw error if invalid address was passed."
  );

  t.is(
    error.message,
    errors.INVALID_ADDRESS,
    "removeChecksum() should throw correct error message."
  );
});
