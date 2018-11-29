/**
 * Testing Script to test getTransactionToApprove
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */

import { expect } from "chai";
import "mocha";
import { getTransactionsToApprove } from "../src/getTransactionsToApprove";

let result: any; // variable to store response
before("Running getTransactionToApprove API Call", async function() {
  this.timeout(0);
  result = await getTransactionsToApprove; // function to be executed before testing
});
// todo_this : check test
describe("getTransactionToApprove  test", () => {
  it("it should return trunckTransactions  details", () => {
    expect(result.trunkTransaction).to.match(/^([A-Z]|[9]){2 * 32}$/);
  });

  it("it should return branchTransactions details", () => {
    expect(result.branchTransaction).to.match(/^([A-Z]|[9]){2 * 32}$/);
  });
});
