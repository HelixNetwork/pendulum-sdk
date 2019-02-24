<<<<<<< HEAD
import test from "ava";
import { hex, toHBytes } from "@helixnetwork/converter";
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
test("Winternitz signatures!", t => {
  let msg: string =
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
          normalizedBundleHash(toHBytes(msg)).slice(i * 16, (i + 1) * 16),
          keyHBytes.slice(i * 512, (i + 1) * 512)
        )
      )
    );

  const isValid = validateSignatures(addressHBytes, signature, msg);
  t.is(isValid, true, "Winternitz signatures should be valid!");
});
=======
import test from "ava";
import { hex, toHBytes } from "@helixnetwork/converter";
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
test("Winternitz signatures!", t => {
  //console.log("--------------- Witernitz signature ----------------");
  let msg: string =
    "0505fa03fa01fe00fcfefc0703ff02000005010603fdfd03fc0303fafef907f9";

  // console.log("------------- Input data ----------------");
  // console.log("Seed = " + seed + " [" + seed.length / 2 + "]");
  // console.log("Msg  = " + msg + " [" + msg.length / 2 + "]");
  //
  // console.log("------------- Processed data ----------------");
  const securityLevel = 2;
  //const privateKey = generatePrivateKey(seed);
  const keyHBytes = key(subseed(toHBytes(seed), 2), securityLevel);
  const digestsHBytes = digests(keyHBytes);
  const addressHBytes = hex(address(digestsHBytes));

  // console.log(
  //   "PrivateKey  = " + hex(keyHBytes) + " [" + keyHBytes.length + "]"
  // );
  // console.log(
  //   "PublicKey  = " + addressHBytes + " [" + addressHBytes.length / 2 + "]"
  // );

  const signature = Array(securityLevel)
    .fill(null)
    .map((_, i) =>
      hex(
        signatureFragment(
          normalizedBundleHash(toHBytes(msg)).slice(i * 16, (i + 1) * 16),
          keyHBytes.slice(i * 512, (i + 1) * 512)
        )
      )
    );

  // console.log(
  //   "Signature " +
  //     signature +
  //     " [" +
  //     signature.length * signature[0].length / 2 +
  //     "]"
  // );

  const isValid = validateSignatures(addressHBytes, signature, msg);

  // console.log("Is valid signature  = " + isValid);
  t.is(isValid, true, "Winternitz signatures should be valid!");
  // console.log("-------------end Witernitz signature ----------------");
});
>>>>>>> test
