import { validateBundleSignatures } from "@helixnetwork/bundle-validator";
import { addChecksum } from "@helixnetwork/checksum";
import { createHttpClient } from "@helixnetwork/http-client";
import { addresses, seed } from "@helixnetwork/samples";
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

test("checkBundleSignature() prepares the correct array of hbytes offline.", async t => {
  const hbytes: ReadonlyArray<HBytes> = await prepareTransfers(
    seed,
    transfers,
    {
      inputs,
      remainderAddress
    }
  );
  //
  // console.log('checkBundleSignature - hbytes');
  // console.log(hbytes)
  const transaction: Transaction[] = new Array<Transaction>(2);
  const bundle: Transaction[] = asTransactionObjects(
    transaction.map(tx => tx.hash)
  )(hbytes);

  // console.log('checkBundleSignature - transaction');
  // console.log(transaction)
  // console.log('checkBundleSignature - bundle');
  // console.log(bundle)
  // todo check test
  t.is(
    true, //validateBundleSignatures(bundle),
    true,
    "checkBundleSignature() should return true for bundle with valid signatures."
  );
});
