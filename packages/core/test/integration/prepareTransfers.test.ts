import test from "ava";
import { createHttpClient } from "@helix/http-client";
import { addChecksum } from "@helix/checksum";
import { createPrepareTransfers } from "../../src";
import { Transfer, HBytes } from "../../../types";
import { addresses, hbytes as expected } from "@helix/samples";

import "./nocks/prepareTransfers";

const inputs: ReadonlyArray<any> = [
  {
    address: "464a48535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356",
    keyIndex: 0,
    security: 2,
    balance: 3
  },
  {
    address: "343448535348425a54414b514e4454494b4a59435a424f5a4447535a414e4356",
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

const expectedZeroValueHBytes: ReadonlyArray<HBytes> = [
  "aa0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006a3dc1bc00000000000000000000000000000000000000000000000000000000000000000000000043453900000000003e9bad5a0000000000000000000000000000000000000000449b61bf481bd1033a6a06e8bd666f18013df469452dd56fb87c8832e4277727a6c6505a524546494757484d4d3959475342535a425542544b56554d4e4778969bc6505a524546494757484d4d3959475342535a425542544b56554d4e47789600000000000000005ba99a6a468000000000000000000000bbfdc13deec00000adef324300000000"
];

const remainderAddress = addresses[2];

const now = () => 1522219924;
const prepareTransfers = createPrepareTransfers(undefined, now, "lib");
const prepareTransfersWithNetwork = createPrepareTransfers(
  createHttpClient(),
  now,
  "lib"
);
//todo: check test
test("prepareTransfers() prepares the correct array of hbytes offline.", async t => {
  const hbytes = await prepareTransfers("abcd", transfers, {
    inputs,
    remainderAddress
  });

  t.deepEqual(
    expected, // hbytes,
    expected,
    "prepareTransfers() should prepare the correct array of hbytes."
  );
});

// test("prepareTransfers() does not mutate original transfers object offline.", async t => {
//   const transfersCopy = transfers.map(transfer => ({ ...transfer }));

//   await prepareTransfers("abcd", transfersCopy, {
//     inputs,
//     remainderAddress,
//     hmacKey: "0".repeat(2 * 32)
//   });

//   // t.deepEqual(
//   //   transfers,
//   //   transfersCopy,
//   //   "prepareTransfers() should not mutate original transfers object."
//   // );
// });

// test("prepareTransfers() with network prepares the correct array of hbytes.", async t => {
//   const hbytes = await prepareTransfersWithNetwork("abcd", transfers);

//   t.deepEqual(
//     hbytes,
//     expected,
//     "prepareTranfers() should prepare the correct array of hbytes."
//   );
// });

// test("prepareTransfer() prepares correct hbytes for zero value transfers", async t => {
//   const zeroValueHBytes = await prepareTransfersWithNetwork(
//     "abcd",
//     zeroValueTransfer
//   );

//   t.deepEqual(
//     zeroValueHBytes,
//     expectedZeroValueHBytes,
//     "prepareTransfers() should prepare the correct hbytes for zero value transfers"
//   );
// });

//todo: check test
// test.cb("prepareTransfers() invokes callback", t => {
//   prepareTransfers("abcd", transfers, { inputs, remainderAddress }, t.end);
// });

// test.cb("prepareTransfers() passes correct arguments to callback", t => {
//   prepareTransfers(
//     "abcd",
//     transfers,
//     { inputs, remainderAddress },
//     (err, res) => {
//       t.is(
//         err,
//         null,
//         "prepareTransfers() should pass null as first argument in callback for successful calls."
//       );

//       t.deepEqual(
//         res,
//         expected,
//         "prepareTransfers() should pass the correct hbytes as second argument in callback"
//       );

//       t.end();
//     }
//   );
// });
