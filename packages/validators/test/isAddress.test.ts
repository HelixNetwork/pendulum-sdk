import test from "ava";
import { isAddress } from "../src";

test("isAddress()", t => {
  const validAddressWithChecksum =
    "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1fbe825a41";
  const validAddressWithoutChecksum =
    "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1f";
  const validAddressWithInvalidChecksum =
    "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1fcaa02118";
  const addressOfInvalidLength =
    "0ce6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1f89";
  const addressOfInvalidTxHex =
    "0cR6dc815205498cde28c048104a366227c39362c06ccff93c29aa8ee1268c1f";

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
    isAddress(addressOfInvalidTxHex),
    false,
    "isAddress() should return false for input of invalid hBytes."
  );
});
