import { validateBundleSignatures } from "@helixnetwork/bundle-validator";
import { addChecksum } from "@helixnetwork/checksum";
import { createHttpClient } from "@helixnetwork/http-client";
import { seed, addresses } from "@helixnetwork/samples";
import { asTransactionObjects } from "@helixnetwork/transaction-converter";
import test from "ava";
import { HBytes, Transaction, Transfer } from "../../../types";
import { createPrepareTransfers } from "../../src";
import "./nocks/prepareTransfers";

const inputs: ReadonlyArray<any> = [
  {
    address: addresses[0],
    keyIndex: 0,
    security: 2,
    balance: 3
  }
];

const transfers: ReadonlyArray<Transfer> = [
  {
    address: addChecksum("a".repeat(2 * 32)),
    value: 3,
    tag: "aaaa",
    message: "0"
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
// todo check test
test("checkBundleSignature() prepares the correct array of hbytes offline.", async t => {
  const hbytes: ReadonlyArray<HBytes> = await prepareTransfers(
    "abcd",
    transfers,
    {
      inputs,
      remainderAddress
    }
  );
  const transaction: Transaction[] = new Array<Transaction>(2);
  const bundle: Transaction[] = asTransactionObjects(
    transaction.map(tx => tx.hash)
  )(hbytes);
  t.is(
    validateBundleSignatures(bundle),
    true,
    "checkBundleSignature() should return true for bundle with valid signatures."
  );
});
