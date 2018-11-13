/**
 * Testing Script to test getTips
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */

import { assert, expect } from "chai";
import "mocha";
import { getTips } from "../src/getTips";

let result: any; // variable to store response

before("Running getTips API Call", async function() {
  this.timeout(0);
  result = await getTips;
});

describe("getTips test", () => {
  it("it should return an array of Tips in the node", () => {
    assert.isArray(result);
  });
  it("Content of array should be string", () => {
    assert.isString(result[0]);
  });
  it("Content of getTips should be having a spcified pattern", () => {
    expect(result).to.match(/^([A-Z]|[9])*$/);
  });
});
