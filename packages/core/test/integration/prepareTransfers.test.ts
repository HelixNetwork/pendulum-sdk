import { addChecksum } from "@helixnetwork/checksum";
import { createHttpClient } from "@helixnetwork/http-client";
import { addresses, hbytes as expected } from "@helixnetwork/samples";
import test from "ava";
import { HBytes, Transfer } from "../../../types";
import { createPrepareTransfers } from "../../src";
import "./nocks/prepareTransfers";

const inputs: ReadonlyArray<any> = [
  {
    address: addresses[0],
    keyIndex: 0,
    security: 2,
    balance: 3
  },
  {
    address: addresses[1],
    keyIndex: 1,
    security: 2,
    balance: 4
  }
];

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

const remainderAddress = addresses[2];

const now = () => 1522219924;
const prepareTransfers = createPrepareTransfers(undefined, now, "lib");
const prepareTransfersWithNetwork = createPrepareTransfers(
  createHttpClient(),
  now,
  "lib"
);
test("prepareTransfers() prepares the correct array of tx offline.", async t => {
  const hbytes = await prepareTransfers("abcd", transfers, {
    inputs,
    remainderAddress
  });
  t.deepEqual(
    hbytes,
    expected,
    "prepareTransfers() should prepare the correct array of tx."
  );
});

test("prepareTransfers() does not mutate original transfers object offline.", async t => {
  const transfersCopy = transfers.map(transfer => ({ ...transfer }));
  await prepareTransfers("abcd", transfersCopy, {
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

test.cb("prepareTransfers() invokes callback", t => {
  prepareTransfers("abcd", transfers, { inputs, remainderAddress }, t.end);
});
test.cb("prepareTransfers() passes correct arguments to callback", t => {
  prepareTransfers(
    "abcd",
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
        "prepareTransfers() should pass the correct tx as second argument in callback"
      );
      t.end();
    }
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

test("prepareTransfers() throws error for inputs without security level.", async t => {
  const input: any = {
    address: "b".repeat(2 * 32),
    keyIndex: 0,
    balance: 1
  };

  t.is(
    t.throws(() =>
      prepareTransfers(
        "abc",
        [
          {
            address: "a".repeat(2 * 32),
            value: 1
          }
        ],
        {
          inputs: [input]
        }
      )
    ).message,
    `Invalid input: ${input}`,
    "prepareTransfers() should throw error for inputs without security level."
  );
});
