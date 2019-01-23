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
let hash: String; // variable to store transaction hash
before("Running findTransactions API Call", async function() {
  this.timeout(0);
  const addr = await generateAddress(config.seed); // function to be executed before testing
  console.log("addr " + addr);
  const transaction = await createTransaction(addr, 0, "SAMPLE", "SAMPLETAG"); // generating a sample transaction to verify
  const address = [transaction[0].address];
  const bundles = [transaction[0].bundle];
  const tag = [transaction[0].tag];
  hash = transaction[0].hash;
  result = await findTransactions(address, bundles, tag);
});

describe("findTransactions  test", () => {
  it("it should return the hash of the transactions executed", () => {
    assert.equal(hash, result[0]); // the hash of the created transaction should be successfully fectched by the Api
  });
});
