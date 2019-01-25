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

before("Running generateAddress API Call", async function() {
  this.timeout(0);
  addr = await generateAddress(
    "953c8169027a85415692cc05bd3a91f95c3be8e5c93c1d2b2e2c447b5ed082d2"
  );
});
describe("Generate new address", () => {
  it("It should return a new address of type string", async () => {
    assert.typeOf(addr, "string");
  });
  it("It should return a new address of containing Characters a-z OR 0-9 and should only have length 64", async () => {
    expect(addr).to.match(/^([a-f0-9]|[9]){64}$/); // checks whether the address generated is valid one
  });
});
