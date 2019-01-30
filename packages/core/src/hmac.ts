import { hbits, hbytes } from "@helixnetwork/converter";
import HHash from "@helixnetwork/hash-module";
import {
  HASH_HBYTE_SIZE,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE
} from "../../constants";
import { Bundle } from "../../types";

const HMAC_ROUNDS = 27;

export default function addHMAC(transactions: Bundle, key: Int8Array): Bundle {
  const bundleHashHBits = hbits(transactions[0].bundle);

  const hHash = new HHash(HHash.HASH_ALGORITHM_2, HMAC_ROUNDS);
  const hmac = new Int8Array(hHash.getHashLength());

  hHash.initialize();
  hHash.absorb(key, 0, hHash.getHashLength());
  hHash.absorb(bundleHashHBits, 0, hHash.getHashLength());
  hHash.squeeze(hmac, 0, hHash.getHashLength());

  const hmacHBytes = hbytes(hmac);

  return transactions.map(
    transaction =>
      transaction.value > 0
        ? {
            ...transaction,
            signatureMessageFragment: hmacHBytes.concat(
              transaction.signatureMessageFragment.substr(
                HASH_HBYTE_SIZE,
                SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE
              ) // 81 - 2187
            )
          }
        : transaction
  );
}
