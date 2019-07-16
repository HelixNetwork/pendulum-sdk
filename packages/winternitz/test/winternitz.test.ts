import { hex, toHBytes } from "@helixnetwork/converter";
import test from "ava";
import {
  HASH_BYTE_SIZE,
  SECURITY_LEVELS,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE,
  SIGNATURE_TOTAL_BYTE_SIZE
} from "../../constants";
import {
  address,
  digests,
  key,
  normalizedBundleHash,
  signatureFragments,
  subseed,
  validateSignatures
} from "../src";

const seed = "abcd000000000000000000000000000000000000000000000000000000000000";
const keyIndex = 2;
const msg: string =
  "0505fa03fa01fe00fcfefc0703ff02000005010603fdfd03fc0303fafef907f9";

test("Winternitz signatures - security level 1!", t => {
  const isValid = testWinternitz(1);
  t.is(
    isValid,
    true,
    "Winternitz signatures should be valid for security level 1!"
  );
});

test("Winternitz signatures - security level 2!", t => {
  const isValid = testWinternitz(2);
  t.is(
    isValid,
    true,
    "Winternitz signatures should be valid for security level 2!"
  );
});

test("Winternitz signatures - security level 3!", t => {
  const isValid = testWinternitz(3);
  t.is(
    isValid,
    true,
    "Winternitz signatures should be valid for security level 3!"
  );
});

test("Winternitz signatures - security level 4!", t => {
  const isValid = testWinternitz(4);
  t.is(
    isValid,
    true,
    "Winternitz signatures should be valid for security level 4!"
  );
});

function testWinternitz(securityLevel: number) {
  const keyHBytes = key(subseed(toHBytes(seed), keyIndex), securityLevel);
  const digestsHBytes = digests(keyHBytes);
  const addressHBytes = hex(address(digestsHBytes));
  const sig = hex(
    signatureFragments(toHBytes(seed), keyIndex, securityLevel, toHBytes(msg))
  );

  const signature = Array(securityLevel)
    .fill(null)
    .map((_, i) =>
      sig.slice(
        i * SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE,
        (i + 1) * SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE
      )
    );

  const isValid = validateSignatures(addressHBytes, signature, msg);
  return isValid;
}
