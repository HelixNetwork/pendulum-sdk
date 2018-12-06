import test from "ava";
import { isAddressArray } from "../src";

test("isAddressArray()", t => {
  const addresses = [
    "03fb82bde446c6de39a5a7c4dc5d2f28318c8e0fa79a2ede420f6cacfe305458b2"
  ];
  const addressesWithChecksum = [
    "03fb82bde446c6de39a5a7c4dc5d2f28318c8e0fa79a2ede420f6cacfe305458b2c30f8ffc"
  ];
  const addressesOfInvalidLength = [
    "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db9bfb3cdc123"
  ];
  const addressesOfInvalidHBytes = [
    "03f549072c534a49fTB5cd9229eab76748478158ee7097c6a8dcdd3a84000596db"
  ];
  const addressesOfInvalidSecurity = [
    "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db123123123"
  ];
  const addressesOfInvalidIndex = [
    "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db1234443221"
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
    isAddressArray(addressesOfInvalidHBytes),
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
