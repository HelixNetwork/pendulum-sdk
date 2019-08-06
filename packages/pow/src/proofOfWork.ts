import { hex } from "@helixnetwork/converter";
import Sha3 from "@helixnetwork/sha3";
import { ChildProcess } from "child_process";
import * as os from "os";
import { ILLEGAL_DIFFICULTY, ILLEGAL_TX_BYTES_LENGTH } from "./errors";
import { MinerArgs } from "./miner/minerArgs";
import { MinerEvents, MinerMessage } from "./miner/minerMessage";

const BN = require("bcrypto/lib/bn.js");
const childProcess = require("child_process");

const SIZE = 768;

export const powTx = async (
  txBytes: Uint8Array,
  minWeightMagnitude: number
) => {
  const result = await search(txBytes, minWeightMagnitude, os.cpus().length);
  return result;
};

export const powBundle = async (
  txBytesArray: Uint8Array[],
  minWeightMagnitude: number
) => {
  const nonces: any = [];
  for (const txBytes of txBytesArray) {
    nonces.push(await powTx(txBytes, minWeightMagnitude));
  }
  return nonces;
};

export const search = (
  txBytes: Uint8Array,
  minWeightMagnitude: number,
  numberOfThreads: number
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    if (txBytes == null || txBytes.length !== SIZE) {
      reject(
        new Error(
          ILLEGAL_TX_BYTES_LENGTH + (txBytes == null ? null : txBytes.length)
        )
      );
      return;
    }
    minWeightMagnitude *= 8;
    if (minWeightMagnitude < 1 || minWeightMagnitude > 255) {
      reject(new Error(ILLEGAL_DIFFICULTY + minWeightMagnitude));
      return;
    }

    if (numberOfThreads < 1 || numberOfThreads > 16) {
      numberOfThreads = Math.max(1, Math.floor(os.cpus().length * 8 / 10));
    }
    const target = Uint8Array.from(
      new BN(2)
        .pow(new BN(256 - minWeightMagnitude))
        .toArrayLike(Buffer, "be", Sha3.HASH_LENGTH)
    );

    const miners: ChildProcess[] = [];
    for (let i = 0; i < numberOfThreads; i++) {
      const miner = childProcess.fork(__dirname + "/miner/miner");
      miner.on("message", (response: any) => {
        if (response && response.txHex && response.nonce) {
          sendAbortSignal(miners);
          resolve(response.txHex);
        }
      });
      miners.push(miner);
    }

    miners.forEach((miner, index) => {
      const minerArgs = new MinerArgs(
        hex(txBytes),
        hex(target),
        index + 1,
        numberOfThreads
      );
      miner.send(new MinerMessage(MinerEvents.START, minerArgs));
    });
  });
};

function sendAbortSignal(miners: ChildProcess[]) {
  miners.forEach(miner => {
    miner.kill();
  });
}

export const increment = (nonce: Uint8Array): boolean => {
  const startIndex = 0;
  let i;
  for (i = nonce.length - 1; i >= startIndex; i--) {
    nonce[i]++;
    if (nonce[i] !== 0) {
      break;
    }
  }
  // Returns false when all bytes are 0 again
  return i >= startIndex || nonce[startIndex] !== 0;
};

export const compareTo = (
  buffer1: Uint8Array,
  offset1: number,
  length1: number,
  buffer2: Uint8Array,
  offset2: number,
  length2: number
): number => {
  // Short circuit equal case
  if (buffer1 === buffer2 && offset1 === offset2 && length1 === length2) {
    return 0;
  }
  const end1 = offset1 + length1;
  const end2 = offset2 + length2;
  for (let i = offset1, j = offset2; i < end1 && j < end2; i++, j++) {
    const a = buffer1[i] & 0xff;
    const b = buffer2[j] & 0xff;
    if (a !== b) {
      return a - b;
    }
  }
  return length1 - length2;
};
