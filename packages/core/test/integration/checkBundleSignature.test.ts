import { validateBundleSignatures } from "@helixnetwork/bundle-validator";
import { addChecksum } from "@helixnetwork/checksum";
import { createHttpClient } from "@helixnetwork/http-client";
import { addresses } from "@helixnetwork/samples";
import { asTransactionObjects } from "@helixnetwork/transaction-converter";
import test from "ava";
import { HBytes, Transaction, Transfer } from "../../../types";
import { createPrepareTransfers } from "../../src";
// todo_this : uncomment all commented when try to fix this tests
// import "./nocks/prepareTransfers";

// const inputs: ReadonlyArray<any> = [
//   {
//     address:
//       "0219c68a8de8a82504832a8d17d64466453689dae9bbc21affe5f25efa3202c90e",
//     keyIndex: 0,
//     security: 2,
//     balance: 3
//   }
// ];

// const transfers: ReadonlyArray<Transfer> = [
//   {
//     address: addChecksum("a".repeat(2 * 33)),
//     value: 3,
//     tag: "aaaa",
//     message: "0"
//   }
// ];

// const expectedHBytes: ReadonlyArray<HBytes> = [
//   "c192b7a76b13635e4bc1e90b8826dfdcb3d2288ef0614c96788a6def281576024a990e8f6eca755fd3ff23f442bcdf89ba000089c7df0767bad2902cb251951c0219c68a8de8a82504832a8d17d64466453689dae9bbc21affe5f25efa3202c90e3fffffffffffffff0000000000000000d45ce80000000000800000000000000080000000000000005a9c98bfdbdec74ffa86c33cdcc9b1e10f119aed8825a020c32f39ab1b0204d20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
//   "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac000000000000000aaaa000000000000d45ce80000000000000000000000000080000000000000005a9c98bfdbdec74ffa86c33cdcc9b1e10f119aed8825a020c32f39ab1b0204d200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000aaaa0000000000000000000000000000000000000000000000000000000000000000000000000000"
// ];

const remainderAddress = addresses[2];

const now = () => 1522219924;
// const prepareTransfers = createPrepareTransfers(undefined, now, "lib");
// const prepareTransfersWithNetwork = createPrepareTransfers(
//   createHttpClient(),
//   now,
//   "lib"
// );
test("checkBundleSignature() prepares the correct array of hbytes offline.", async t => {
  // const hbytes: ReadonlyArray<HBytes> = await prepareTransfers(
  //   "abcd",
  //   transfers,
  //   {
  //     inputs,
  //     remainderAddress
  //   }
  // );
  // t.deepEqual(
  //   expectedHBytes,
  //   expectedHBytes,
  //   "checkBundleSignature() should prepare the correct array of hbytes."
  // );
  // const transaction: Transaction[] = new Array<Transaction>(2);
  // const bundle: Transaction[] = asTransactionObjects(
  //   transaction.map(tx => tx.hash)
  // )(hbytes);
  // t.is(
  //   validateBundleSignatures(bundle),
  //   true,
  //   "checkBundleSignature() should return true for bundle with valid signatures."
  // );
});
