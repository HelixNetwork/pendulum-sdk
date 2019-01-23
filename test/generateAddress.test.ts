import { assert, expect } from "chai";
import "mocha";
import * as config from "../src/config";
import { generateAddress } from "../src/generateAddress";
/**
 * Testing Script to test generate Address
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */
let addr: string; // variable to store the address

before("Running generateAddress API Call", async () => {
  // this.timeout(0);
  addr = await generateAddress(config.seed);
});
describe("Generate new address", () => {
  it("It should return a new address of type string", async () => {
    assert.typeOf(addr, "string");
  });
  it("It should return a new address of containing Characters A-Z OR 9 and should only havelength 81", async () => {
    expect(addr).to.match(/^([a-f0-9]|[9]){64}$/); // checks whether the address generated is valid one
  });
});
