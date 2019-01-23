import { addNeighbors } from "../src/addNeighbors";
import { removedNeighbors } from "../src/removeNeighbors";
import { assert } from "chai";
import "mocha";
/**
 * Testing Script to test adding neighbors
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */
let addedNeighbors_zero: any; //variable to store the added neighbors to be zero
let addedNeighbors_one: any; //variable to store the added neighbors to be one
let addedNeighbors_two: any; //variable to store the added neighbors to be two
let addedNeighborsError: any;

before("Running addNeighbors API Call", async function() {
  this.timeout(0);
  addedNeighbors_zero = await addNeighbors([]);
  addedNeighbors_one = await addNeighbors(["udp://35.157.69.54:14600"]); //invoking add neighbors
  addedNeighbors_two = await addNeighbors([
    "udp://35.157.69.54:14601",
    "udp://35.157.69.54:14602"
  ]);
  await removedNeighbors([
    "udp://35.157.69.54:14600",
    "udp://35.157.69.54:14601",
    "udp://35.157.69.54:14602"
  ]); //removing added neighbors
  try {
    await addNeighbors([""]); //it should throw an error
  } catch (err) {
    addedNeighborsError = err;
  }
});
describe("addNeighbors  test", () => {
  it("it should return no of succesfull neighbors added in the node which is zero", () => {
    assert.equal(addedNeighbors_zero, "0");
  });
  it("it should return no of succesfull neighbors added in the node which is one", () => {
    assert.equal(addedNeighbors_one, "1");
  });
  it("it should return no of succesfull neighbors added in the node which is two", () => {
    assert.equal(addedNeighbors_two, "2");
  });
  it("it should throw an error", () => {
    assert.isDefined(addedNeighborsError);
  });
});
