import { addChecksum } from "@helixnetwork/checksum";
import { toHBytes } from "@helixnetwork/converter";
import { createHttpClient } from "@helixnetwork/http-client";
import {
  addresses,
  bundleWithValidSignature,
  seed
} from "@helixnetwork/samples";
import { transactionHash } from "@helixnetwork/transaction";
import { ADDRESS_BYTE_SIZE } from "../../constants";
import { HBytes, Transaction, Transfer } from "../../types";
import { composeAPI, createPrepareTransfers } from "../src";

import isBundle from "@helixnetwork/bundle-validator";
import {
  asTransactionHBytes,
  asTransactionObjects
} from "@helixnetwork/transaction-converter";
import { createGetNewAddress } from "../src/createGetNewAddress";
import "../test/integration/nocks/prepareTransfers";

const client = createHttpClient();
const getNewAddress = createGetNewAddress(client, "lib");
const helix = composeAPI({
  provider: "https://hlxtest.net:8087"
});
// let inputs: ReadonlyArray<any> = [
//     {
//         address: "1245e733c1abf577cff3056880f9963ae6170e4bd02c53dcea9db9501e8d52e1",
//         keyIndex: 0,
//         security: 2,
//         balance: 4
//     },
//     {
//         address: "df485155f326d19468056861b677277d48bfbda340bdc05c5c81333e9fc04d8c",
//         keyIndex: 1,
//         security: 2,
//         balance: 4
//     }
// ];
//
// const transfers: ReadonlyArray<Transfer> = [
//     {
//         address: addChecksum("a".repeat(ADDRESS_BYTE_SIZE)),
//         value: 3,
//         tag: "aaaa",
//         message: "abcd"
//     }
// ];
//  const seed = 'abcd000000000000000000000000000000000000000000000000000000000000'

// const now = () => 1522219924;
// const prepareTransfers = createPrepareTransfers(undefined, now, "lib");
// const prepareTransfersWithNetwork = createPrepareTransfers(
//     createHttpClient(),
//     now,
//     "lib"
// );

async function generateBundle() {
  // calculate addressesȘ
  // const addresses: string[] = new Array<string>(3);
  // const addr = await getNewAddress(seed, {index: 0, total: 3, security: 2});
  // for (let i = 0; i < 3; i++) {
  //     addresses[i] = addr[i];
  // }
  //
  // inputs = inputs.map((value, i) => {
  //     value.address = addresses[i];
  //     return value;
  // });
  // const remainderAddress = addresses[2];
  //
  // const hbytes: ReadonlyArray<string> = await prepareTransfers(
  //     seed,
  //     transfers,
  //     {
  //         inputs,
  //         remainderAddress
  //     }
  // );
  // console.log(
  //     "export const bundleHBytes: HBytes[] = " + JSON.stringify([hbytes].reverse()) + ";"
  // );
  // console.log("export const bundle: Transaction[] = ");
  // console.log(
  //     asTransactionObjects(
  //         new Array<Transaction>(hbytes.length).map(tx => tx.hash)
  //     )(hbytes).reverse()
  // );
  // inputs = inputs.slice(0, 1);
  //
  // const bundleWithValidSignature: ReadonlyArray<string> = await prepareTransfers(seed, transfers.slice(0, 1), {
  //     inputs,
  //     remainderAddress
  // });
  // console.log(
  //     "export const bundleWithValidSignatureHBytes = " +
  //     JSON.stringify([...bundleWithValidSignature].reverse()) +
  //     ";"
  // );
  // console.log("export const bundleWithValidSignature = ");
  // const bundleWithValidSig = asTransactionObjects(
  //     new Array<Transaction>(bundleWithValidSignature.length).map(tx => tx.hash)
  // )(bundleWithValidSignature).reverse();
  // console.log(bundleWithValidSig);
  // console.log("isValidBundle:" + isBundle(bundleWithValidSig));
  //

  createAndPrintBundle(
    "export const bundle: Transaction[] = ",
    "export const bundleHBytes: HBytes[] = ",
    seed,
    [
      {
        address: addChecksum("a".repeat(ADDRESS_BYTE_SIZE)),
        value: 3,
        tag: "aaaa",
        message: "abcd"
      }
    ],
    [
      {
        address: addresses[0],
        keyIndex: 0,
        security: 2,
        balance: 4
      },
      {
        address: addresses[1],
        keyIndex: 1,
        security: 2,
        balance: 4
      }
    ],
    addresses[2]
  );

  createAndPrintBundle(
    "export const bundleWithValidSignature = ",
    "export const bundleWithValidSignatureHBytes = ",
    seed,
    [
      {
        address: addChecksum("a".repeat(ADDRESS_BYTE_SIZE)),
        value: 3,
        tag: "aaaa",
        message: "abcd"
      }
    ],
    [
      {
        address: addresses[0],
        keyIndex: 0,
        security: 2,
        balance: 3
      }
    ]
  );

  createAndPrintBundle(
    "export const bundleWithZeroValue = ",
    "export const bundleWithZeroValueHBytes = ",
    seed,
    [
      {
        address: addChecksum("a".repeat(ADDRESS_BYTE_SIZE)),
        value: 0,
        tag: "aaaa",
        message: "abcd"
      }
    ]
  );
}

async function createAndPrintBundle(
  msgBundle: string,
  msgHbytes: string,
  currentSeed: string,
  transfers: ReadonlyArray<Transfer>,
  inputs?: ReadonlyArray<any>,
  remainderAddress?: string
) {
  try {
    let resultHbytes: ReadonlyArray<string>;

    if (!inputs && !remainderAddress) {
      resultHbytes = await helix.prepareTransfers(currentSeed, transfers);
    } else {
      resultHbytes = await helix.prepareTransfers(currentSeed, transfers, {
        inputs,
        remainderAddress
      });
    }
    attachIntoTangle(msgBundle, msgHbytes, resultHbytes);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);
  }
}

async function attachIntoTangle(
  msgBundle: string,
  msgHbytes: string,
  hbytes: ReadonlyArray<string>
) {
  try {
    const resultBundle = await helix.sendHBytes(
      hbytes,
      5 /*depth*/,
      2 /*minimum weight magnitude*/
    );
    console.log(
      "----------------------------------------------------------------------------"
    );
    console.log(msgBundle);
    console.log(resultBundle);

    console.log(msgHbytes);
    const resultHbytes = asTransactionHBytes(resultBundle);
    console.log(resultHbytes);
    for (var i = 0; i < resultHbytes.length; i++) {
      let computedTransactionHash = transactionHash(toHBytes(resultHbytes[i]));

      console.log(
        "New computed hash (in helix.lib): " + computedTransactionHash
      );
      console.log(
        "Equal hashes? " + resultBundle[i]["hash"] == computedTransactionHash
      );
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);
  }
}

generateBundle();
