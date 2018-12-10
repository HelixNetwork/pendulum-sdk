import { seed, addresses, hbytes as expected } from "@helixnetwork/samples";
import { HBytes, Transfer, Transaction } from "../../types";
import { ADDRESS_BYTE_SIZE } from "../../constants";
import { createPrepareTransfers } from "../src";
import { addChecksum } from "@helixnetwork/checksum";
import { createHttpClient } from "@helixnetwork/http-client";

import { createGetNewAddress } from "../src/createGetNewAddress";
const client = createHttpClient();
const getNewAddress = createGetNewAddress(client, "lib");
import "../test/integration/nocks/prepareTransfers";
import { asTransactionObjects } from "@helixnetwork/transaction-converter";

let inputs: ReadonlyArray<any> = [
  {
    address: "toBeReplacedWithIndex0_Security2",
    keyIndex: 0,
    security: 2,
    balance: 3
  },
  {
    address: "toBeReplacedWithIndex1_Security2",
    keyIndex: 1,
    security: 2,
    balance: 4
  }
];

const transfers: ReadonlyArray<Transfer> = [
  {
    address: addChecksum("a".repeat(ADDRESS_BYTE_SIZE)),
    value: 3,
    tag: "aaaa",
    message: "0"
  },
  {
    address: addChecksum("b".repeat(ADDRESS_BYTE_SIZE)),
    value: 3,
    tag: "aaaa"
  }
];
//const seed = 'abcd000000000000000000000000000000000000000000000000000000000000'
const now = () => 1522219924;
const prepareTransfers = createPrepareTransfers(undefined, now, "lib");
const prepareTransfersWithNetwork = createPrepareTransfers(
  createHttpClient(),
  now,
  "lib"
);
async function generateBundle() {
  // calculate addressesȘ
  const addresses: string[] = new Array<string>(3);
  const addr = await getNewAddress(seed, { index: 0, total: 3 });
  for (let i = 0; i < 3; i++) {
    addresses[i] = addr[i];
  }

  inputs = inputs.map((value, i) => {
    value.address = addresses[i];
    return value;
  });
  const remainderAddress = addresses[2];

  const hbytes: ReadonlyArray<string> = await prepareTransfers(
    seed,
    transfers,
    {
      inputs,
      remainderAddress
    }
  );
  console.log(
    "export const hbytes = " + JSON.stringify([hbytes].reverse()) + ";"
  );
  console.log("export const bundle = ");
  console.log(
    asTransactionObjects(
      new Array<Transaction>(hbytes.length).map(tx => tx.hash)
    )(hbytes).reverse()
  );
  inputs = inputs.slice(0, 1);

  const bundleWithValidSignature: ReadonlyArray<
    string
  > = await prepareTransfers(seed, transfers.slice(0, 1), {
    inputs,
    remainderAddress
  });
  console.log(
    "export const bundleWithValidSignatureHBytes = " +
      JSON.stringify([...bundleWithValidSignature].reverse()) +
      ";"
  );
  console.log("export const bundleWithValidSignature = ");
  console.log(
    asTransactionObjects(
      new Array<Transaction>(bundleWithValidSignature.length).map(tx => tx.hash)
    )(bundleWithValidSignature).reverse()
  );
}

generateBundle();