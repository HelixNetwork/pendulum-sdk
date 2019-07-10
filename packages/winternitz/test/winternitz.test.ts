import { hex, toHBytes } from "@helixnetwork/converter";
import test from "ava";
import {
  HASH_BYTE_SIZE,
  SECURITY_LEVELS,
  SIGNATURE_TOTAL_BYTE_SIZE
} from "../../constants";
import {
  address,
  digests,
  key,
  normalizedBundleHash,
  signatureFragment,
  subseed,
  validateSignatures
} from "../src";

const seed = "abcd000000000000000000000000000000000000000000000000000000000000";
test("Winternitz signatures - security level 2!", t => {
  const msg: string =
    "0505fa03fa01fe00fcfefc0703ff02000005010603fdfd03fc0303fafef907f9";
  const securityLevel = 2;

  const keyHBytes = key(subseed(toHBytes(seed), 2), securityLevel);
  const digestsHBytes = digests(keyHBytes);
  const addressHBytes = hex(address(digestsHBytes));

  const signature = Array(securityLevel)
    .fill(null)
    .map((_, i) =>
      hex(
        signatureFragment(
          normalizedBundleHash(toHBytes(msg)).slice(
            i * HASH_BYTE_SIZE / SECURITY_LEVELS,
            (i + 1) * HASH_BYTE_SIZE / SECURITY_LEVELS
          ),
          keyHBytes.slice(
            i * SIGNATURE_TOTAL_BYTE_SIZE,
            (i + 1) * SIGNATURE_TOTAL_BYTE_SIZE
          )
        )
      )
    );
  // tslint:disable-next-line:no-console
  console.log(signature);
  const isValid = validateSignatures(addressHBytes, signature, msg);

  t.is(isValid, true, "Winternitz signatures should be valid!");
});
