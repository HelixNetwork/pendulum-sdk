import { hex, longToBytes, toTxBytes } from "@helixnetwork/converter";
import Sha3 from "@helixnetwork/sha3";
import { START_INDEX_NONCE_BYTE } from "../../../constants";
import { compareTo } from "../proofOfWork";
import { MinerEvents, MinerMessage } from "./minerMessage";
import { MinerResponse } from "./minerResponse";

const NONCE_SIZE = 8;
process.on("message", (minerMessage: MinerMessage) => {
  if (MinerEvents.START === minerMessage.event && minerMessage.message) {
    const minerArgs = minerMessage.message;

    const result = toTxBytes(minerArgs.txBytes);
    const startIndex = START_INDEX_NONCE_BYTE;

    result.fill(0, startIndex, startIndex + NONCE_SIZE);
    for (let nonce = minerArgs.offset; nonce > 0; nonce += minerArgs.step) {
      const nonceBytes = longToBytes(nonce);
      for (let i = startIndex; i < startIndex + NONCE_SIZE; i++) {
        result[i] = nonceBytes[i - startIndex];
      }
      const hash = new Uint8Array(Sha3.HASH_LENGTH);
      const sha3 = new Sha3();
      sha3.absorb(result, 0, result.length);
      sha3.squeeze(hash, 0, Sha3.HASH_LENGTH);
      if (
        compareTo(
          hash,
          0,
          Sha3.HASH_LENGTH,
          toTxBytes(minerArgs.target),
          0,
          Sha3.HASH_LENGTH
        ) < 0
      ) {
        // @ts-ignore
        process.send(new MinerResponse(hex(nonceBytes), hex(result)));
        return;
      }
    }
  } else {
    // Invalid message received
    // @ts-ignore
    process.send(
      new MinerResponse(
        undefined,
        undefined,
        `Invalid message received, disconnecting miner. Args: ${JSON.stringify(
          minerMessage
        )}`
      )
    );
    process.kill(process.pid);
  }
});
