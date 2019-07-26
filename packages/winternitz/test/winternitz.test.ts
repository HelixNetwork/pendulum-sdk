import { hex, toTxBytes } from "@helixnetwork/converter";
import test from "ava";
import {
  HASH_BYTE_SIZE,
  SECURITY_LEVELS,
  SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE,
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
const keyIndex = 0;
const msg: string =
  "380a8ce38e34ea3de9a76c678259223a2a915e9905200c3a3067c6aa9eea05a4";

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
  const keyHBytes = key(subseed(toTxBytes(seed), keyIndex), securityLevel);
  const digestsHBytes = digests(keyHBytes);
  const addressHBytes = hex(address(digestsHBytes));
  const sig = hex(
    signatureFragments(toTxBytes(seed), keyIndex, securityLevel, toTxBytes(msg))
  );

  const signature = Array(securityLevel)
    .fill(null)
    .map((_, i) =>
      sig.slice(
        i * SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE,
        (i + 1) * SIGNATURE_MESSAGE_FRAGMENT_TX_HEX_SIZE
      )
    );

  const isValid = validateSignatures(addressHBytes, signature, msg);
  return isValid;
}
