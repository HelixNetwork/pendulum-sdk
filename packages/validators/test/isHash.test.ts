import test from "ava";
import { isHash } from "../src";

test("isHash()", t => {
  const validHash =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee";
  const validHashWithChecksum =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee11111111";
  const invalidHash =
    "abc1233445234234232Zaaaccac1233445234234232adedeadea123344523ee";

  t.is(isHash(validHash), true, "hash() should return true for valid hash.");

  t.is(
    isHash(validHashWithChecksum),
    true,
    "hash() should return true for valid hash with checksum."
  );

  t.is(
    isHash(invalidHash),
    false,
    "hash() should return false for invalid hash"
  );
});
