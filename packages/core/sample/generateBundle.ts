import { addChecksum } from "@helixnetwork/checksum";
import { toTxBytes } from "@helixnetwork/converter";
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

async function generateBundle() {
  await createAndPrintBundle(
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

  await createAndPrintBundle(
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

  await createAndPrintBundle(
    "export const bytesTransaction = ",
    "export const transactionStrings = ",
    seed,
    [
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
    ],
    [
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
    ]
  );

  await createAndPrintBundle(
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

  await createAndPrintBundle(
    "prepare transfer: export const bundleWithZeroValue = ",
    "expectedZeroValueHBytes = ",
    seed,
    [
      {
        address: "0".repeat(2 * 32),
        value: 0,
        message: "aa",
        tag: "0000000000000000"
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
  txs: ReadonlyArray<string>
) {
  try {
    const resultBundle = await helix.sendTransactionStrings(
      txs,
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
      let computedTransactionHash = transactionHash(toTxBytes(resultHbytes[i]));

      console.log(
        "New computed hash (in helix.lib): " + computedTransactionHash
      );
      console.log("Old hash (in helix.lib): " + resultBundle[i]["hash"]);
      console.log(
        "Equal hashes? " + (resultBundle[i]["hash"] === computedTransactionHash)
      );
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);
  }
}

generateBundle();
