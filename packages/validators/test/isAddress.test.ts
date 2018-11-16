import test from "ava";
import { isAddress } from "../src";

test("isAddress()", t => {
  const validAddressWithChecksum =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523eed101b796";
  const validAddressWithoutChecksum =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee";
  const validAddressWithInvalidChecksum =
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee11111111";
  const addressOfInvalidLength =
    "aabc1233445234234232aaaaaccac1233445234234232adedeadea123344523eeaccaaaaaaaaaaaaaeeeeee";
  const addressOfInvalidTrytes =
    "XVDD1233445234234232BDFESABCD1233445234234232BDFESABCD123344523E";

  t.is(
    isAddress(validAddressWithChecksum),
    true,
    "isAddress() should return true for valid address with valid checksum."
  );

  t.is(
    isAddress(validAddressWithoutChecksum),
    false,
    "isAddress() should return false for valid address without checksum."
  );

  t.is(
    isAddress(validAddressWithInvalidChecksum),
    false,
    "isAddress() should return false for valid address with invalid checksum."
  );

  t.is(
    isAddress(addressOfInvalidLength),
    false,
    "isAddress() should return false for input of invalid length."
  );

  t.is(
    isAddress(addressOfInvalidTrytes),
    false,
    "isAddress() should return false for input of invalid hBytes."
  );
});
