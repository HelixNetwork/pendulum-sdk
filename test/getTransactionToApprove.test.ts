import { expect } from "chai";
import "mocha";
import { getTransactionsToApprove } from "../src/getTransactionsToApprove";

/**
 * Testing Script to test getTransactionToApprove
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */
let result: any; // variable to store response
before("Running getTransactionToApprove API Call", async function() {
  this.timeout(0);
  result = await getTransactionsToApprove; // function to be executed before testing
});

describe("getTransactionToApprove  test", () => {
  it("it should return trunckTransactions  details", () => {
    expect(result.trunkTransaction).to.match(/^([a-f0-9]){64}$/);
  });

  it("it should return branchTransactions details", () => {
    expect(result.branchTransaction).to.match(/^([a-f0-9]){64}$/);
  });
});
