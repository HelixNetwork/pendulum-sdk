import { getTransactionsToApprove } from "../src/getTransactionsToApprove";
import { attachToTangle } from "../src/attachToTangle";
import { getTrytes } from "../src/getTrytes";
import { createTransaction } from "../src/createTransaction";
import { generateAddress } from "../src/generateAddress";
import * as config from "../src/config";
import { expect } from "chai";
import "mocha";

/**
 * Testing Script to test getTransactionToApprove
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */
let result: any; //variable to store response
before("Running attachToTangle API Call", async function() {
  this.timeout(0);
  const addr = await generateAddress(config.seed);
  let transaction = await createTransaction(addr, 0, "SAMPLE", "SAMPLETAG");
  let transactionApprove = await getTransactionsToApprove; //function to be executed before testing
  let trytes = await getTrytes([transaction[0]["hash"]]);
  result = await attachToTangle(
    transactionApprove["trunkTransaction"],
    transactionApprove["branchTransaction"],
    trytes
  );
});

describe("attachTotangle test", () => {
  it("it should return Array of transaction trytes with nonce and attachment timestamps details", () => {
    expect(result).to.match(/^([A-Z]|[9])*$/);
  });
});
