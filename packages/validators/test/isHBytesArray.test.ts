import test from "ava";
import { hbytes } from "@helix/samples";
import { isHBytesArray } from "../src";

test("isHBytesArray()", t => {
  const invalidHBytes = [
    "JALLWDUOSTSJVL9EEHKW9YQFPBVBJAGLNKRVGSQZCGHQWEMIIILJMTHVAGVDXJVZMBAMOZTSBQNRVNLLSJMPIVGPNE",
    "fdsafBCDWDUOSTSJEEHKW9YQFPBVBJAGLNKRVGSQZCGHQWEMIIILJMTHVAGVDXJVZMBAMOZTSBQRVNLLSJ"
  ];

  t.deepEqual(
    isHBytesArray(hbytes),
    true,
    "isHBytesArray() returns true for valid hbytes"
  );

  t.deepEqual(
    isHBytesArray(invalidHBytes),
    false,
    "isHBytesArray() return false for invalid hbytes"
  );
});
