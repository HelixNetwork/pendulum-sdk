import { hbits, hbytes } from "@helix/converter";
import Curl from "@helix/curl";
import { Bundle } from "../../types";

const HMAC_ROUNDS = 27;

export default function addHMAC(transactions: Bundle, key: Int8Array): Bundle {
  const curl = new Curl(HMAC_ROUNDS);
  const bundleHashHBits = hbits(transactions[0].bundle);
  const hmac = new Int8Array(Curl.HASH_LENGTH);

  curl.initialize();
  curl.absorb(key, 0, Curl.HASH_LENGTH);
  curl.absorb(bundleHashHBits, 0, Curl.HASH_LENGTH);
  curl.squeeze(hmac, 0, Curl.HASH_LENGTH);

  const hmacHBytes = hbytes(hmac);

  return transactions.map(
    transaction =>
      transaction.value > 0
        ? {
            ...transaction,
            signatureMessageFragment: hmacHBytes.concat(
              transaction.signatureMessageFragment.substr(81, 2187)
            )
          }
        : transaction
  );
}
