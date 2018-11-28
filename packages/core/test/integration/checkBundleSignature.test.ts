import test from "ava";
import { createHttpClient } from "@helix/http-client";
import { addChecksum } from "@helix/checksum";
import { asTransactionObjects } from "@helix/transaction-converter";
import { createPrepareTransfers } from "../../src";
import { Transfer, HBytes, Transaction } from "../../../types";
import { addresses } from "@helix/samples";
import { validateBundleSignatures } from "@helix/bundle-validator";

import "./nocks/prepareTransfers";

const inputs: ReadonlyArray<any> = [
  {
    address:
      "026c08a725df89465b864ee768fa1802005de2f6cb6b3a62137c6d2b383b5566de",
    keyIndex: 0,
    security: 2,
    balance: 3
  }
];

const transfers: ReadonlyArray<Transfer> = [
  {
    address: addChecksum("a".repeat(2 * 33)),
    value: 3,
    tag: "aaaa",
    message: "0"
  }
];

const expectedHBytes: ReadonlyArray<HBytes> = [
  "10c4201c911364e424ec1e6c241268ca29b87c2a8b5a1097a28d873604ccfd0ce28d91cbbde0e5059a48c1e30bd98b87abde6116e244ce2e6d0c2ba880b5671e026c08a725df89465b864ee768fa1802005de2f6cb6b3a62137c6d2b383b5566de3fffffffffffffff0000000000000000d45ce8000000000080000000000000008000000000000000eb09d67743b63f15669aab736523ec8a180facdcd17a240c24386941f420700d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac000000000000000eaaa000000000000d45ce8000000000000000000000000008000000000000000eb09d67743b63f15669aab736523ec8a180facdcd17a240c24386941f420700d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000aaaa0000000000000000000000000000000000000000000000000000000000000000000000000000"
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
    "abcd",
    transfers,
    {
      inputs,
      remainderAddress
    }
  );

  t.deepEqual(
    hbytes,
    expectedHBytes,
    "checkBundleSignature() should prepare the correct array of hbytes."
  );
  const transaction: Transaction[] = new Array<Transaction>(2);

  let bundle: Transaction[] = asTransactionObjects(
    transaction.map(tx => tx.hash)
  )(hbytes);
  t.is(
    validateBundleSignatures(bundle),
    true,
    "checkBundleSignature() should return true for bundle with valid signatures."
  );
});
