/** @module  extract-json */

import { txsToAscii } from "@helixnetwork/converter";
import { Bundle, Transaction } from "../../types";

export const errors = {
  INVALID_JSON: "Invalid JSON encoded message",
  INVALID_BUNDLE: "Invalid bundle"
};

export { Bundle, Transaction };

const numericTxHexRegex = /^(2d|2b)?(30|31|32|33|34|35|36|37|38|39)+((2e)(30|31|32|33|34|35|36|37|38|39)+)?((65|45)(2d|2b)?(30|31|32|33|34|35|36|37|38|39)+)?00/;
/**
 * Takes a bundle as input and from the signatureMessageFragments extracts the correct JSON
 * data which was encoded and sent with the transaction.
 * Supports the following forms of JSON encoded values:
 * - `"{ \"message\": \"hello\" }"\`
 * - `"[1, 2, 3]"`
 * - `"true"`, `"false"` & `"null"`
 * - `"\"hello\""
 * - `123`
 *
 * @example
 *
 * ```js
 * try {
 *   const msg = JSON.parse(extractJson(bundle))
 * } catch (err) {
 *   err.msg == errors.INVALID_BUNDLE
 *   // Invalid bundle or invalid encoded JSON
 * }
 * ```
 *
 * @example
 * Example with `getBundle`:
 *
 * ```js
 * getBundle(tailHash)
 *   .then(bunlde => {
 *      const msg = JSON.parse(extractJson(bundle))
 *      // ...
 *   })
 *   .catch((err) => {
 *      // Handle network & extraction errors
 *   })
 * ```
 *
 * @method extractJson
 *
 * @param {array} bundle
 *
 * @returns {string | number | null}
 */
export const extractJson = (bundle: Bundle): string | number | null => {
  if (!Array.isArray(bundle) || bundle[0] === undefined) {
    throw new Error(errors.INVALID_BUNDLE);
  }
  // Sanity check: if the first byte pair is not opening bracket, it's not a message
  const firstTxHexPair =
    bundle[0].signatureMessageFragment[0] +
    bundle[0].signatureMessageFragment[1];

  let lastTxHexPair = "";

  if (firstTxHexPair === "7b") {
    // encoding for {
    lastTxHexPair = "7d"; // encoding for }
  } else if (firstTxHexPair === "22") {
    // encoding for "
    lastTxHexPair = "22"; // encoding for "
  } else if (firstTxHexPair === "5b") {
    // enconding for [
    lastTxHexPair = "5d"; // encoding for ]
  } else if (bundle[0].signatureMessageFragment.slice(0, 10) === "66616c7365") {
    return "false";
  } else if (bundle[0].signatureMessageFragment.slice(0, 8) === "74727565") {
    return "true";
  } else if (bundle[0].signatureMessageFragment.slice(0, 8) === "6e756c6c") {
    return "null";
  } else if (numericTxHexRegex.test(bundle[0].signatureMessageFragment)) {
    // Parse numbers, source: https://github.com/iotaledger/iota.lib.js/issues/231#issuecomment-402383449
    const num = bundle[0].signatureMessageFragment.match(
      /^([0-9a-f][0-9a-f])*?(0{2})/
    );
    if (num) {
      return parseFloat(txsToAscii(num[0]));
    }
    throw new Error(errors.INVALID_JSON);
  } else {
    throw new Error(errors.INVALID_JSON);
  }

  let index = 0;
  let notEnded = true;
  let txsChunk = "";
  let txsChecked = 0;
  let preliminaryStop = false;
  let finalJson = "";

  while (index < bundle.length && notEnded) {
    const messageChunk = bundle[index].signatureMessageFragment;
    // We iterate over the message chunk, reading 9 txs at a time
    for (let i = 0; i < messageChunk.length; i += 8) {
      // get 9 txs
      const txs = messageChunk.slice(i, i + 8);
      txsChunk += txs;

      // Get the upper limit of the tytes that need to be checked
      // because we only check 2 txs at a time, there is sometimes a leftover
      const upperLimit = txsChunk.length - txsChunk.length % 2;

      const txsToCheck = txsChunk.slice(txsChecked, upperLimit);

      // We read 2 txs at a time and check if it equals the closing bracket character
      for (let j = 0; j < txsToCheck.length; j += 2) {
        const txsPair = txsToCheck[j] + txsToCheck[j + 1];

        // If closing bracket char was found, and there are only trailing 0's
        // we quit and remove the 0's from the txsChunk.
        if (preliminaryStop && txsPair === "00") {
          notEnded = false;
          // TODO: Remove the trailing 9's from txsChunk
          // var closingBracket = txsToCheck.indexOf('QD') + 1;

          // txsChunk = txsChunk.slice( 0, ( txsChunk.length - txsToCheck.length ) + ( closingBracket % 2 === 0 ? closingBracket : closingBracket + 1 ) );

          break;
        }

        finalJson += txsToAscii(txsPair);

        // If txs pair equals closing bracket char, we set a preliminary stop
        // the preliminaryStop is useful when we have a nested JSON object
        if (txsPair === lastTxHexPair) {
          preliminaryStop = true;
        }
      }

      if (!notEnded) {
        break;
      }
      txsChecked += txsToCheck.length;
    }

    // If we have not reached the end of the message yet, we continue with the next
    // transaction in the bundle
    index += 1;
  }

  // If we did not find any JSON, return null
  if (notEnded) {
    throw new Error(errors.INVALID_JSON);
  } else {
    return finalJson;
  }
};
