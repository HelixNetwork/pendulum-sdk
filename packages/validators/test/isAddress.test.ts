import test from "ava";
import { isAddress } from "../src";

test("isAddress()", t => {
  const validAddressWithChecksum =
    "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db9bfb3cdc";
  const validAddressWithoutChecksum =
    "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db";
  const validAddressWithInvalidChecksum =
    "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db12345678";
  const addressOfInvalidLength =
    "03f549072c534a49f125cd9229eab76748478158ee7097c6a8dcdd3a84000596db12345678123";
  const addressOfInvalidHBytes =
    "TRc1233445234234232aaaaaccac1233445234234232adedeadea123344523eed101b796";

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
    isAddress(addressOfInvalidHBytes),
    false,
    "isAddress() should return false for input of invalid hBytes."
  );
});
