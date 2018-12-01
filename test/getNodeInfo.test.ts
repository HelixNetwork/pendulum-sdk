/**
 * Testing Script to test getNodeInfo
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */

import { assert, expect } from "chai";
import "mocha";
import { getNodeInfo } from "../src/getNodeInfo";

let result: any; // variable to store response
before("Running getNodeInfo API Call", async function() {
  this.timeout(0);
  result = await getNodeInfo; // function to be executed before testing
});
// todo_this : check test
describe("getNodeInfo test", () => {
  it("it should return a succesfull info about the node", () => {
    assert.isObject(result);
  });
  it("it should have a specific structure", () => {
    expect(result).not.to.have.property("Error");
    expect(result)
      .to.have.property("latestSolidSubtangleMilestone")
      .to.match(/^([A-Z]|[9])*$/);
    expect(result)
      .to.have.property("latestMilestone")
      .to.match(/^([A-Z]|[9])*$/);
  });
});
//
