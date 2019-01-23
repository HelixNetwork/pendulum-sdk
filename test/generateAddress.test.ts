import { generateAddress } from "../src/generateAddress";
import * as config from "../src/config";
import { assert } from "chai";
import { expect } from "chai";
import "mocha";
/**
 * Testing Script to test generate Address
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */
let addr: String; //variable to store the address

before("Running generateAddress API Call", async function() {
  this.timeout(0);
  addr = await generateAddress(config.seed);
});
describe("Generate new address", () => {
  it("It should return a new address of type string", async function() {
    assert.typeOf(addr, "string");
  });
  it("It should return a new address of containing Characters A-Z OR 9 and should only havelength 81", async function() {
    expect(addr).to.match(/^([A-Z]|[9]){81}$/); // checks whether the address generated is valid one
  });
});
