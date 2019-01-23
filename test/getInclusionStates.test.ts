import { assert } from "chai";
import "mocha";
import * as config from "../src/config";
import { createTransaction } from "../src/createTransaction";
import { generateAddress } from "../src/generateAddress";
import { getInclusionStates } from "../src/getInclusionStates";
import { getTips } from "../src/getTips";

/**
 * Testing Script to test getInclusion States
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */
let result: any; // variable to store response
let Error: any;
before("Running getInclusion API Call", async () => {
  //this.timeout(0);
  const addr = await generateAddress(config.seed); // function to be executed before testing
  const transaction = await createTransaction(addr, 0, "SAMPLE", "SAMPLETAG"); // generating a sample transaction to verify
  const hash = [transaction[0].hash];
  const tips = await getTips;
  result = await getInclusionStates(hash, tips);
  try {
    await getInclusionStates(["6"], tips); // should throw an error
  } catch (error) {
    Error = error;
  }
});

describe("getInclusionState  test", () => {
  it("it should return a boolean value ", () => {
    assert.isBoolean(result[0]);
  });
  it("it should throw a successful error", () => {
    assert.isDefined(Error);
  });
});
