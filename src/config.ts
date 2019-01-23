//Configuration for transacting using Helix

//ENTER YOUR SEED VALUE
export const seed = `B9SSJM9QBQUPFWUWMQOLRADCKPHUHEFFVXWXCCNPRLVMVTVYBTQFESOSSHCMMJPWMZISWM9XUWEZZAHIY`;

//ENTER THE PROVIDER ADDRESS
export const provider = "https://helix:LW59AG75A84GSEES@hlxtest.net:14701";

// Depth or how far to go for tip selection entry point
export const depth = 3;

// Difficulty of Proof-of-Work required to attach transaction to tangle.
// Minimum value on mainnet & spamnet is `14`, `9` on devnet and other testnets.
export const minWeightMagnitude = 10;
