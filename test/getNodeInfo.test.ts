import { assert, expect } from "chai";
import "mocha";
import { getNodeInfo } from "../src/getNodeInfo";

/**
 * Testing Script to test getNodeInfo
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */
interface reference {
  appName: string;
  appVersion: string;
  duration: number;
  jreAvailableProcessors: number;
  jreFreeMemory: number;
  jreMaxMemory: number;
  jreTotalMemory: number;
  latestMilestone: string;
  latestMilestoneIndex: number;
  latestSolidSubtangleMilestone: string;
  latestSolidSubtangleMilestoneIndex: number;
  neighbors: number;
  packetsQueueSize: number;
  time: number;
  tips: number;
  transactionsToRequest: number;
}
let result: reference; // variable to store response
before("Running getNodeInfo API Call", async function() {
  this.timeout(0);
  result = await getNodeInfo; // function to be executed before testing
});

describe("getNodeInfo test", () => {
  it("it should return a successful info about the node", () => {
    assert.isObject(result);
  });
  it("it should have a specific structure", () => {
    expect(result).not.to.have.property("Error");
    expect(result)
      .to.have.property("latestSolidSubtangleMilestone")
      .to.match(/^([a-f0-9])*$/);
    expect(result)
      .to.have.property("latestMilestone")
      .to.match(/^([a-f0-9])*$/);
  });
});
//
