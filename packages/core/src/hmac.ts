import { trits, trytes } from "@helix/converter";
import SHA256 from "@helix/sha256";
import { Bundle } from "../../types";

const HMAC_ROUNDS = 27;

export default function addHMAC(transactions: Bundle, key: Int8Array): Bundle {
  const sha256 = new SHA256();
  const bundleHashTrits = trits(transactions[0].bundle);
  const hmac = new Int8Array(SHA256.HASH_LENGTH);

  sha256.initialize();
  sha256.update(key, 0, SHA256.HASH_LENGTH);
  sha256.update(bundleHashTrits, 0, SHA256.HASH_LENGTH);
  sha256.final(hmac, 0, SHA256.HASH_LENGTH);

  const hmacTrytes = trytes(hmac);

  return transactions.map(
    transaction =>
      transaction.value > 0
        ? {
            ...transaction,
            signatureMessageFragment: hmacTrytes.concat(
              transaction.signatureMessageFragment.substr(81, 2187)
            )
          }
        : transaction
  );
}
