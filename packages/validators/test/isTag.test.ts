import test from "ava";
import { isTag } from "../src";

test("isTag() returns true for valid tag.", t => {
  t.is(isTag("aaaa"), true, "isTag() should return true for valid tag.");

  t.is(
    isTag("aaaa".repeat(4)),
    true,
    "isTag() should return true for valid tag."
  );
});

test("isTag() returns false for tag tag.", t => {
  t.is(
    isTag("Ahaaa"),
    false,
    "isTag() should return false for tag of invalid bytes."
  );

  t.is(
    isTag("aaaaa".repeat(4) + "a"),
    false,
    "isTag() should return false for tag of invalid length."
  );
});
