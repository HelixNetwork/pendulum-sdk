import { assert, expect } from "chai";
import "mocha";
import * as config from "../src/config";
import { createTransaction } from "../src/createTransaction";
import { generateAddress } from "../src/generateAddress";

/**
 * Testing Script to test createTransaction
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */

let result: any; // variable to store response
let Error: any;
let addr: any;
before("Running createTransaction API Call", async function() {
  this.timeout(0);
  addr = await generateAddress(config.seed);
  result = await createTransaction(addr, 0, "SAMPLE", "SAMPLETAG"); // function to be executed before testing
  try {
    await createTransaction("", 0, "SAMPLE", "SAMPLETAG");
  } catch (error) {
    Error = error;
  }
});

describe("Create Transactions  test", () => {
  it("it should create and return a successful transaction info", async () => {
    assert.isArray(result);
    expect(result[0])
      .to.have.property("hash")
      .to.match(/^([a-f0-9])*$/);
    expect(result[0])
      .to.have.property("address")
      .equals(addr);
  });
  it("it should throw a successful error", () => {
    assert.isDefined(Error);
  });
});
