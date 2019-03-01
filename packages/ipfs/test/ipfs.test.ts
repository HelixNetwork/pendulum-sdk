import { hex, toHBytes } from "@helixnetwork/converter";
import test from "ava";
import Ipfs from "../src";

/** @todo wip */
test("Ipfs: pull()/push()", t => {
  const input =
    "c02c4aa8852301f3eb7b926f320d911bb178ba1ec4159f67d6cc1d75ef9a62f8";
  const pushPull = (input: string): string => {
    let output = input; // pushing and pulling here...
    return output;
  };

  t.is(
    pushPull(input),
    input,
    "Pushed message should correspond to pulled message."
  );
});
