import { getNeighbors } from "../src/getNeighbors";
import { assert, expect } from "chai";
import "mocha";

/**
 * Testing Script to test getNeighbors
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */

let result: any; //variable to store response
before("Running getNeighbors API Call", async function() {
  this.timeout(0);
  result = await getNeighbors; //function to be executed before testing
});

describe("getNeighbors  test", () => {
  it("it should return a succesfull info about the neighbors in the node", () => {
    assert.isArray(result);
  });
  it("it should return a succesfull info about the neighbors in the node", () => {
    expect(result[0]).to.have.property("address");
    expect(result[0]).to.have.property("numberOfAllTransactions");
    expect(result[0]).not.to.have.property("Error");
  });
});
