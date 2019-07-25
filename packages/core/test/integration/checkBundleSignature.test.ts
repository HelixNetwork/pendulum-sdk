import { validateBundleSignatures } from "@helixnetwork/bundle-validator";
import { addChecksum } from "@helixnetwork/checksum";
import { hex, toTxBytes } from "@helixnetwork/converter";
import { createHttpClient } from "@helixnetwork/http-client";
import { addresses, seed } from "@helixnetwork/samples";
import { asTransactionObjects } from "@helixnetwork/transaction-converter";
import { address, digests, key, subseed } from "@helixnetwork/winternitz";
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

  const keyHBytes = key(subseed(toTxBytes(seed), 0), 2);
  const digestsHBytes = digests(keyHBytes);
  const addressHBytes = hex(address(digestsHBytes));

  const transaction: Transaction[] = new Array<Transaction>(hbytes.length);
  const bundle: Transaction[] = asTransactionObjects(
    transaction.map(tx => tx.hash)
  )(hbytes);

  t.is(
    validateBundleSignatures(bundle),
    true,
    "checkBundleSignature() should return true for bundle with valid signatures."
  );
});
