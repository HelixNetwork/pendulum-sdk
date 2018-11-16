import test from "ava";
import { isAddressArray } from "../src";

test("isAddressArray()", t => {
  const addresses = [
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee"
  ];
  const addressesWithChecksum = [
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523eed101b796"
  ];
  const addressesOfInvalidLength = ["abc12334452344523ee"];
  const addressesOfInvalidTrytes = ["SDFSDAFdasfaSDF"];
  const addressesOfInvalidSecurity = [
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee21456398"
  ];
  const addressesOfInvalidIndex = [
    "abc1233445234234232aaaaaccac1233445234234232adedeadea123344523ee21456398"
  ];

  t.is(
    isAddressArray(addresses),
    false,
    "isAddressArray() should return true for valid address array without checksum."
  );

  t.is(
    isAddressArray(addressesWithChecksum),
    true,
    "isAddressArray() should return true for valid addresses with checksum."
  );

  t.is(
    isAddressArray(addressesOfInvalidLength),
    false,
    "isAddressArray() should return false for addresses of invalid length."
  );

  t.is(
    isAddressArray(addressesOfInvalidTrytes),
    false,
    "isAddressArray() should return false for addresses of invalid hBytes."
  );

  t.is(
    isAddressArray(addressesOfInvalidSecurity),
    false,
    "isAddressArray() should return false for addresses of invalid security level."
  );

  t.is(
    isAddressArray(addressesOfInvalidIndex),
    false,
    "isAddressArray() should return false for addresses of invalid index."
  );
});
