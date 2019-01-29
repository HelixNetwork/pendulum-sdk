import { assert } from "chai";
import "mocha";
import { addNeighbors } from "../src/addNeighbors";
import { removedNeighbors } from "../src/removeNeighbors";

/**
 * Testing Script to test removeNeighbors
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */
let removeNeighbors_zero: any; // variable to store the added neighbors to be zero
let removeNeighbors_one: any; // variable to store the added neighbors to be one
let removeNeighbors_two: any; // variable to store the added neighbors to be two
let removeNeighborsError: any;

before("Running removeNeighbors API Call", async function() {
  this.timeout(0);

  await addNeighbors([
    "udp://35.157.69.54:14600",
    "udp://35.157.69.54:14601",
    "udp://35.157.69.54:14602"
  ]);
  removeNeighbors_zero = await removedNeighbors([]); // function to be executed before testing
  removeNeighbors_one = await removedNeighbors(["udp://35.157.69.54:14600"]);
  removeNeighbors_two = await removedNeighbors([
    "udp://35.157.69.54:14601",
    "udp://35.157.69.54:14602"
  ]);
  try {
    await removedNeighbors([""]);
  } catch (error) {
    removeNeighborsError = error;
  }
});

describe("removeNeighbors  test", () => {
  it("it should return no of succesfull neighbors removed in the node i.e zero", () => {
    assert.equal(removeNeighbors_zero, "0");
  });
  it("it should return no of succesfull neighbors removed in the node i.e one", () => {
    assert.equal(removeNeighbors_one, "1");
  });
  it("it should return no of succesfull neighbors removed in the node i.e two", () => {
    assert.equal(removeNeighbors_two, "2");
  });
  it("it should throw an error", () => {
    assert.isDefined(removeNeighborsError);
  });
});
