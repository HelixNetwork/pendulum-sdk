import { assert } from "chai";
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
  it("it should return the hash of the transactions executed", () => {
    assert.equal(config.firstTransactionHash, result[0]); // the hash of the created transaction should be successfully fectched by the Api
  });
});
