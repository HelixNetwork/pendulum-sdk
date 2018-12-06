import test from "ava";
import { isAddress } from "../src";

test("isAddress()", t => {
  const validAddressWithChecksum =
    "0219c68a8de8a82504832a8d17d64466453689dae9bbc21affe5f25efa3202c90e67dd9452";
  const validAddressWithoutChecksum =
    "03fb82bde446c6de39a5a7c4dc5d2f28318c8e0fa79a2ede420f6cacfe305458b2";
  const validAddressWithInvalidChecksum =
    "03fb82bde446c6de39a5a7c4dc5d2f28318c8e0fa79a2ede420f6cacfe305458b212547862";
  const addressOfInvalidLength =
    "03fb82bde446c6de39a5a7c4dc5d2f28318c8e0fa79a2ede420f6cacfe305458b";
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
