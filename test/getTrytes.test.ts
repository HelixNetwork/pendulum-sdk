/**
 * Testing Script to test getTrytes
 *
 *  @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 */

import { assert, expect } from "chai";
import "mocha";
import { getTrytes } from "../src/getTrytes";

let result: any; // variable to store response
let error: any; // variable to store error
before("Running getTrytes API Call", async function() {
  this.timeout(0);
  result = await getTrytes([
    "OAATQS9VQLSXCLDJVJJVYUGONXAXOFMJOZNSYWRZSWECMXAQQURHQBJNLD9IOFEPGZEPEMPXCIVRX9999"
  ]); // function to be executed before testing
  try {
    await getTrytes([
      "OAATQS9VQLSXCLDJVJJVYUGONXAXOFMJOZNSYWRZSWECMXAQQLD9IOFEPGZEPEMPXCIVRX9999" // it shouldthrow an error
    ]);
  } catch (err) {
    error = err;
  }
});
// todo_this : check test
describe("getTrytes test", () => {
  it("it should return the raw transaction data (trytes) of a specific transaction.", () => {
    assert.isArray(result);
  });
  it("Content of array should be having a spcified pattern", () => {
    expect(result).to.match(/^([A-Z]|[9])*$/);
  });
  it("It should throw an error", () => {
    assert.isDefined(error);
  });
});
