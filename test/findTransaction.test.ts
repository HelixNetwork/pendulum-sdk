import { assert, expect } from "chai";
import "mocha";
import * as config from "../src/config";
import { createTransaction } from "../src/createTransaction";
import { findTransactions } from "../src/findtransaction";
import { generateAddress } from "../src/generateAddress";

/**
 * Testing Script to test findTransaction
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */

let result: any; // variable to store response
before("Running findTransactions API Call", async function() {
  this.timeout(0);
  const address = [
    "a3fcb75bbfc68db05a5207c2afc97fc496ec86e7ecdd6a933be4d1bad8f74c34"
  ];

  result = await findTransactions(address);
});

describe("findTransactions  test", () => {
  it("It should return a new address of containing Characters a-z OR 0-9 and should only have length 64", async () => {
    expect(result[0]).to.match(/^([a-f0-9]|[9]){64}$/); // checks whether the address generated is valid one
  });
});
