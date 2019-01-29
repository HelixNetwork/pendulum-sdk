// Configuration for transacting using Helix

// ENTER YOUR SEED VALUE
export const seed = `953c8169027a85415692cc05bd3a91f95c3be8e5c93c1d2b2e2c447b5ed082d2`;

// ENTER THE PROVIDER ADDRESS
export const provider = "http://18.225.7.0:14700";

// Depth or how far to go for tip selection entry point
export const depth = 3;

// Difficulty of Proof-of-Work required to attach transaction to tangle.
// Minimum value on mainnet & spamnet is `14`, `9` on devnet and other testnets.
export const minWeightMagnitude = 10;

export const firstTransactionHash =
  "0081705006577f469f15c695bd214ac9e68bfa4c57a32cf586fc6caaa3b5cf09";
