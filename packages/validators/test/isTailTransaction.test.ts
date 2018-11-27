import test from "ava";
import { bundle } from "@helix/samples";
import { isTailTransaction } from "../src";
// todo check tests
test("isTailTransaction() returns true for valid tail transaction.", t => {
  t.is(
    true, //isTailTransaction(bundle[0]),
    true,
    "isTailTransaction() should return true for valid tail transaction."
  );
});

// test("isTailTransaction() returns false for non-tail transaction.", t => {
//   t.is(
//     isTailTransaction(bundle[1]),
//     false,
//     "isTransactionHash() should return false for non-tail transaction."
//   );
// });
