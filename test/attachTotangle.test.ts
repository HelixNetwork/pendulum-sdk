/**
 * Testing Script to test getTransactionToApprove
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */

import { expect } from "chai";
import "mocha";
import { attachToTangle } from "../src/attachToTangle";
import * as config from "../src/config";
import { createTransaction } from "../src/createTransaction";
import { generateAddress } from "../src/generateAddress";
import { getTransactionsToApprove } from "../src/getTransactionsToApprove";
import { getTrytes } from "../src/getTrytes";

let result: any; // variable to store response
before("Running attachToTangle API Call", async function() {
  this.timeout(0);
  const addr = await generateAddress(config.seed);
  const transaction = await createTransaction(addr, 0, "SAMPLE", "SAMPLETAG");
  const transactionApprove = await getTransactionsToApprove; // function to be executed before testing
  const key = "hash";
  const t1 = "trunkTransaction";
  const t2 = "branchTransaction";
  const trytes = await getTrytes([transaction[0][key]]);
  result = await attachToTangle(
    transactionApprove[t1],
    transactionApprove[t2],
    trytes
  );
});

describe("attachTotangle test", () => {
  it("it should return Array of transaction trytes with nonce and attachment timestamps details", () => {
    expect(result).to.match(/^([A-Z]|[9])*$/);
  });
});
