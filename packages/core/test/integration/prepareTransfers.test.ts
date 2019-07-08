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

const expectedZeroValueHBytes: ReadonlyArray<HBytes> = [
  "aa00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d45ce80000000000000000000000000000000000000000006eb1ee87e70112e46bd7215f88e32c2da9ea50a2a74a6a1fa0e6cc5fda4dc6360000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
];
const remainderAddress = addresses[2];

const now = () => 1522219924;
const prepareTransfers = createPrepareTransfers(undefined, now, "lib");
const prepareTransfersWithNetwork = createPrepareTransfers(
  createHttpClient(),
  now,
  "lib"
);
// test("prepareTransfers() prepares the correct array of hbytes offline.", async t => {
//     const hbytes = await prepareTransfers("abcd", transfers, {
//         inputs,
//         remainderAddress
//     });
//     t.deepEqual(
//         hbytes,
//         expected,
//         "prepareTransfers() should prepare the correct array of hbytes."
//     );
// });

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
// test("prepareTransfers() with network prepares the correct array of hbytes.", async t => {
//     const hbytes = await prepareTransfersWithNetwork("abcd", transfers);
//     t.deepEqual(
//         hbytes,
//         expected,
//         "prepareTranfers() should prepare the correct array of hbytes."
//     );
// });
// test("prepareTransfer() prepares correct hbytes for zero value transfers", async t => {
//     const zeroValueHBytes = await prepareTransfersWithNetwork(
//         "abcd",
//         zeroValueTransfer
//     );
//     t.deepEqual(
//         zeroValueHBytes,
//         expectedZeroValueHBytes,
//         "prepareTransfers() should prepare the correct hbytes for zero value transfers"
//     );
// });
test.cb("prepareTransfers() invokes callback", t => {
  prepareTransfers("abcd", transfers, { inputs, remainderAddress }, t.end);
});
// test.cb("prepareTransfers() passes correct arguments to callback", t => {
//     prepareTransfers(
//         "abcd",
//         transfers,
//         { inputs, remainderAddress },
//         (err, res) => {
//             t.is(
//                 err,
//                 null,
//                 "prepareTransfers() should pass null as first argument in callback for successful calls."
//             );
//             t.deepEqual(
//                 res,
//                 expected,
//                 "prepareTransfers() should pass the correct hbytes as second argument in callback"
//             );
//             t.end();
//         }
//     );
// });
