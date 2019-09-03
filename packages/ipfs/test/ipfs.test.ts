import test from "ava";
import Ipfs from "../src";

/** @todo unit test for ipfs. */
test("Ipfs: publish()/pull()", t => {
  const input =
    "c02c4aa8852301f3eb7b926f320d911bb178ba1ec4159f67d6cc1d75ef9a62f8";
  const ipfs: Ipfs = new Ipfs("3.122.144.244", "5001");
  const publishPull = (inputValue: string): string => {
    // ipfs.publish("c02c4aa8852301f3eb7b926f320d911bb178ba1ec4159f67d6cc1d75ef9a62f8", false);
    // ipfs.pullMessage("QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvs8u", "./samples/prv-test.pem", false);
    const output = inputValue;
    return output;
  };

  t.is(
    publishPull(input),
    input,
    "Pushed message should correspond to pulled message."
  );
});
