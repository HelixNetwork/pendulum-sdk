import test from "ava";
import { isAddressArray } from "../src";

test("isAddressArray()", t => {
  const addresses = [
    "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1f"
  ];
  const addressesWithChecksum = [
    "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1fcaa02119"
  ];
  const addressesOfInvalidLength = [
    "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1fcaa0211912"
  ];
  const addressesOfInvalidHBytes = [
    "0ce6dc815205498cde28c04y104a366227c39362c06ccff93c29aa8ee1268c1f"
  ];
  const addressesOfInvalidSecurity = [
    "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1fcaa02115"
  ];
  const addressesOfInvalidIndex = [
    "02e6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1fcaa02119"
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
