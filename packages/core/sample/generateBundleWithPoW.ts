import { addChecksum } from "@helixnetwork/checksum";
import { toTxBytes } from "@helixnetwork/converter";
import { createHttpClient } from "@helixnetwork/http-client";
//import { prepareForTangleWithLocalPow } from "@helixnetwork/pow";
import { addresses, seed } from "@helixnetwork/samples";
import { transactionHash } from "@helixnetwork/transaction";
import { asTransactionStrings } from "@helixnetwork/transaction-converter";
import { ADDRESS_HEX_SIZE } from "../../constants";
import { Transfer } from "../../types";
import { composeAPI } from "../src";
import { createGetNewAddress } from "../src/createGetNewAddress";
import "../test/integration/nocks/prepareTransfers";

const client = createHttpClient();
const getNewAddress = createGetNewAddress(client, "lib");
const helix = composeAPI({
  provider: "https://hlxtest.net:8087"
  //attachToTangle: prepareForTangleWithLocalPow
});

async function generateBundle() {
  await createAndPrintBundle(
    "export const bundle: Transaction[] = ",
    "export const bundleTxHex: TxHex[] = ",
    seed,
    [
      {
        address: addChecksum("a".repeat(ADDRESS_HEX_SIZE)),
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
    "prepare transfer: export const bundleWithZeroValue = ",
    "expectedZeroValueTxHex = ",
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
    const resultHbytes = asTransactionStrings(resultBundle);
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
