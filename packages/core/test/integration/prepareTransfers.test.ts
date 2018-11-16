import test from "ava";
import { createHttpClient } from "@helix/http-client";
import { addChecksum } from "@helix/checksum";
import { createPrepareTransfers } from "../../src";
import { Transfer, HBytes } from "../../../types";
import { addresses, hbytes as expected } from "@helix/samples";

import "./nocks/prepareTransfers";

const inputs: ReadonlyArray<any> = [
  {
    address:
      "FJHSSHBZTAKQNDTIKJYCZBOZDGSZANCZSWCNWUOCZXFADNOQSYAHEJPXRLOVPNOQFQXXGEGVDGICLMOXX",
    keyIndex: 0,
    security: 2,
    balance: 3
  },
  {
    address:
      "9DZXPFSVCSSWXXQPFMWLGFKPBAFTHYMKMZCPFHBVHXPFNJEIJIEEPKXAUBKBNNLIKWHJIYQDFWQVELOCB",
    keyIndex: 1,
    security: 2,
    balance: 4
  }
];

const transfers: ReadonlyArray<Transfer> = [
  {
    address: addChecksum("a".repeat(2 * 32)),
    value: 3,
    tag: "TAG",
    message: "0"
  },
  {
    address: addChecksum("b".repeat(2 * 32)),
    value: 3,
    tag: "TAG"
  }
];

const zeroValueTransfer: ReadonlyArray<Transfer> = [
  {
    address: "0".repeat(2 * 32),
    value: 0,
    message: "TEST9MESSAGE",
    tag: "TEST9TAG"
  }
];

const expectedZeroValueHBytes: ReadonlyArray<HBytes> = [
  "TEST9MESSAGE999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999UFST9TAG9999999999999999999MBIWC9999999999999999999999JAUJAZERXHKKZUOWISVT9DLBYCZ9WHKOEYIQSHDVXXLPEDCLXCYTHGBGWPBFZJUPGBGRFGHZAIWKZNERW999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999TEST9TAG9999999999999999999999999999999999999999999999999999999999999999999999999"
];

const remainderAddress = addresses[2];

const now = () => 1522219924;
const prepareTransfers = createPrepareTransfers(undefined, now, "lib");
const prepareTransfersWithNetwork = createPrepareTransfers(
  createHttpClient(),
  now,
  "lib"
);

test("prepareTransfers() prepares the correct array of hbytes offline.", async t => {
  const hbytes = await prepareTransfers("SEED", transfers, {
    inputs,
    remainderAddress
  });

  t.deepEqual(
    hbytes,
    expected,
    "prepareTransfers() should prepare the correct array of hbytes."
  );
});

test("prepareTransfers() does not mutate original transfers object offline.", async t => {
  const transfersCopy = transfers.map(transfer => ({ ...transfer }));

  await prepareTransfers("SEED", transfersCopy, {
    inputs,
    remainderAddress,
    hmacKey: "0".repeat(2 * 32)
  });

  t.deepEqual(
    transfers,
    transfersCopy,
    "prepareTransfers() should not mutate original transfers object."
  );
});

test("prepareTransfers() with network prepares the correct array of hbytes.", async t => {
  const hbytes = await prepareTransfersWithNetwork("SEED", transfers);

  t.deepEqual(
    hbytes,
    expected,
    "prepareTranfers() should prepare the correct array of hbytes."
  );
});

test("prepareTransfer() prepares correct hbytes for zero value transfers", async t => {
  const zeroValueHBytes = await prepareTransfersWithNetwork(
    "SEED",
    zeroValueTransfer
  );

  t.deepEqual(
    zeroValueHBytes,
    expectedZeroValueHBytes,
    "prepareTransfers() should prepare the correct hbytes for zero value transfers"
  );
});

test.cb("prepareTransfers() invokes callback", t => {
  prepareTransfers("SEED", transfers, { inputs, remainderAddress }, t.end);
});

test.cb("prepareTransfers() passes correct arguments to callback", t => {
  prepareTransfers(
    "SEED",
    transfers,
    { inputs, remainderAddress },
    (err, res) => {
      t.is(
        err,
        null,
        "prepareTransfers() should pass null as first argument in callback for successful calls."
      );

      t.deepEqual(
        res,
        expected,
        "prepareTransfers() should pass the correct hbytes as second argument in callback"
      );

      t.end();
    }
  );
});
