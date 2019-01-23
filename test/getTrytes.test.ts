import { assert, expect } from "chai";
import "mocha";
import { getBytes } from "../src/getBytes";

/**
 * Testing Script to test getBytes
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */

let result: any; // variable to store response
let error: any; // variable to store error
let m: any;
before("Running getBytes API Call", async function() {
  this.timeout(0);
  result = await getBytes([
    "e8beb08da8930027eacd19f806a417ff919bafcc216d9e9483398368be3921ea"
  ]); // function to be executed before testing
  try {
    await getBytes([
      "e8beb08da8930027eacd19f806a417ff919bafcc216d9e9483398368be392" // it shouldthrow an error
    ]);
  } catch (err) {
    error = err;
  }
});

describe("getBytes test", () => {
  it("it should return the raw transaction data (trytes) of a specific transaction.", () => {
    assert.isArray(result);
  });
  it("Content of array should be having a spcified pattern", () => {
    expect(result).to.match(/^([a-z0-9])*$/);
  });
  it("It should throw an error", () => {
    assert.isDefined(error);
  });
});
