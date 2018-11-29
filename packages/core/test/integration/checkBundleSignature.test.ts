import { validateBundleSignatures } from "@helix/bundle-validator";
import { addChecksum } from "@helix/checksum";
import { createHttpClient } from "@helix/http-client";
import { addresses } from "@helix/samples";
import { asTransactionObjects } from "@helix/transaction-converter";
import test from "ava";
import { HBytes, Transaction, Transfer } from "../../../types";
import { createPrepareTransfers } from "../../src";

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
  "1c2ccd36821f56396fc4d4bd10daf3e92c1805986e6edd37df2a6149762246c6bf0938f8ad7333ee2775e074bd1aa38eb7f66b9cd171be9199439b4df109f777026c08a725df89465b864ee768fa1802005de2f6cb6b3a62137c6d2b383b5566de3fffffffffffffff0000000000000000d45ce800000000008000000000000000800000000000000004996490e2d51b1e423a2a778b1761b6db722e32ca7077d1c5b9d886246b4f640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaac000000000000000aaaa000000000000d45ce800000000000000000000000000800000000000000004996490e2d51b1e423a2a778b1761b6db722e32ca7077d1c5b9d886246b4f6400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000aaaa0000000000000000000000000000000000000000000000000000000000000000000000000000"
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

  const bundle: Transaction[] = asTransactionObjects(
    transaction.map(tx => tx.hash)
  )(hbytes);
  t.is(
    validateBundleSignatures(bundle),
    true,
    "checkBundleSignature() should return true for bundle with valid signatures."
  );
});
