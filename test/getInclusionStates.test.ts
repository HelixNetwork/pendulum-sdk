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
  const tips = await getTips;

  result = await getInclusionStates(
    // ["006f8c396c26dc0d188f4492d39b78a3b801f573eac5e1b1715dcce7a760d7ca"],
    ["0081705006577f469f15c695bd214ac9e68bfa4c57a32cf586fc6caaa3b5cf09"],
    tips
  );
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
