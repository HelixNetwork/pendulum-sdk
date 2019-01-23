import { getNodeInfo } from "../src/getNodeInfo";
import { assert, expect } from "chai";
import "mocha";

/**
 * Testing Script to test getNodeInfo
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */
interface reference {
  appName: String;
  appVersion: String;
  duration: Number;
  jreAvailableProcessors: Number;
  jreFreeMemory: Number;
  jreMaxMemory: Number;
  jreTotalMemory: Number;
  latestMilestone: String;
  latestMilestoneIndex: Number;
  latestSolidSubtangleMilestone: String;
  latestSolidSubtangleMilestoneIndex: Number;
  neighbors: Number;
  packetsQueueSize: Number;
  time: Number;
  tips: Number;
  transactionsToRequest: Number;
}
let result: reference; //variable to store response
before("Running getNodeInfo API Call", async function() {
  this.timeout(0);
  result = await getNodeInfo; //function to be executed before testing
});

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
