import { addChecksum } from "@helixnetwork/checksum";
import { createHttpClient } from "@helixnetwork/http-client";
import {
  addresses,
  bundleWithValidSignature,
  seed
} from "@helixnetwork/samples";
import { ADDRESS_BYTE_SIZE } from "../../constants";
import { Transaction, Transfer } from "../../types";
import { createPrepareTransfers } from "../src";

import isBundle from "@helixnetwork/bundle-validator";
import { asTransactionObjects } from "@helixnetwork/transaction-converter";
import { createGetNewAddress } from "../src/createGetNewAddress";
import "../test/integration/nocks/prepareTransfers";

const client = createHttpClient();
const getNewAddress = createGetNewAddress(client, "lib");

let inputs: ReadonlyArray<any> = [
  {
    address: "ed7ddda54ba1666c2b760d8d397b88eaa76efb361e4707cd70073234248439f9",
    keyIndex: 0,
    security: 2,
    balance: 4
  },
  {
    address: "6214373e99f3e335e630441a96341fbb8fbff9b416a793e1069c5bd28a76eb53",
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
    message: "abcd"
  }
];
//  const seed = 'abcd000000000000000000000000000000000000000000000000000000000000'
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
  // console.log(
  //   "export const hbytes = " + JSON.stringify([hbytes].reverse()) + ";"
  // );
  // console.log("export const bundle = ");
  // console.log(
  //   asTransactionObjects(
  //     new Array<Transaction>(hbytes.length).map(tx => tx.hash)
  //   )(hbytes).reverse()
  // );
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
  const bundleWithValidSig = asTransactionObjects(
    new Array<Transaction>(bundleWithValidSignature.length).map(tx => tx.hash)
  )(bundleWithValidSignature).reverse();
  console.log(bundleWithValidSig);
  console.log("isValidBundle:" + isBundle(bundleWithValidSig));
}
generateBundle();
