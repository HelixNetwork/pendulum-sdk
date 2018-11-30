/**
 * Testing Script to test adding neighbors
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */

import { assert } from "chai";
import "mocha";
import { addNeighbors } from "../src/addNeighbors";
import { removedNeighbors } from "../src/removeNeighbors";

let addedNeighborsZero: any; // variable to store the added neighbors to be zero
let addedNeighborsOne: any; // variable to store the added neighbors to be one
let addedNeighborsTwo: any; // variable to store the added neighbors to be two
let addedNeighborsError: any;

before("Running addNeighbors API Call", async function() {
  this.timeout(0);
  addedNeighborsZero = await addNeighbors([]);
  addedNeighborsOne = await addNeighbors(["udp://35.157.69.54:14600"]); // invoking add neighbors
  addedNeighborsTwo = await addNeighbors([
    "udp://35.157.69.54:14601",
    "udp://35.157.69.54:14602"
  ]);
  await removedNeighbors([
    "udp://35.157.69.54:14600",
    "udp://35.157.69.54:14601",
    "udp://35.157.69.54:14602"
  ]); // removing added neighbors
  try {
    await addNeighbors([""]); // it should throw an error
  } catch (err) {
    addedNeighborsError = err;
  }
});
// todo_this : check test
describe("addNeighbors  test", () => {
  it("it should return no of succesfull neighbors added in the node which is zero", () => {
    assert.equal(addedNeighborsZero, "0");
  });
  it("it should return no of succesfull neighbors added in the node which is one", () => {
    assert.equal(addedNeighborsOne, "1");
  });
  it("it should return no of succesfull neighbors added in the node which is two", () => {
    assert.equal(addedNeighborsTwo, "2");
  });
  it("it should throw an error", () => {
    assert.isDefined(addedNeighborsError);
  });
});
