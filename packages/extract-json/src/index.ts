/** @module  extract-json */

import { hbytesToAscii } from "@helix/converter";
import { Transaction } from "../../types";

export const errors = {
  INVALID_JSON: "Invalid JSON encoded message",
  INVALID_BUNDLE: "Invalid bundle"
};

const numericHBytesRegex = /^(RA|PA)?(UA|VA|WA|XA|YA|ZA|9B|AB|BB|CB)+((SA)(UA|VA|WA|XA|YA|ZA|9B|AB|BB|CB)+)?((TC|OB)(RA|PA)?(UA|VA|WA|XA|YA|ZA|9B|AB|BB|CB)+)?99/;

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
export const extractJson = (bundle: Transaction[]): string | number | null => {
  if (!Array.isArray(bundle) || bundle[0] === undefined) {
    throw new Error(errors.INVALID_BUNDLE);
  }

  // Sanity check: if the first tryte pair is not opening bracket, it's not a message
  const firstTrytePair =
    bundle[0].signatureMessageFragment[0] +
    bundle[0].signatureMessageFragment[1];

  let lastTrytePair = "";

  if (firstTrytePair === "OD") {
    lastTrytePair = "QD";
  } else if (firstTrytePair === "GA") {
    lastTrytePair = "GA";
  } else if (firstTrytePair === "JC") {
    lastTrytePair = "LC";
  } else if (bundle[0].signatureMessageFragment.slice(0, 10) === "UCPC9DGDTC") {
    return "false";
  } else if (bundle[0].signatureMessageFragment.slice(0, 8) === "HDFDIDTC") {
    return "true";
  } else if (bundle[0].signatureMessageFragment.slice(0, 8) === "BDID9D9D") {
    return "null";
  } else if (numericHBytesRegex.test(bundle[0].signatureMessageFragment)) {
    // Parse numbers, source: https://github.com/iotaledger/iota.lib.js/issues/231#issuecomment-402383449
    const num = bundle[0].signatureMessageFragment.match(/^(.*)99/);
    if (num) {
      return parseFloat(hbytesToAscii(num[1].slice(0, -1)));
    }
    throw new Error(errors.INVALID_JSON);
  } else {
    throw new Error(errors.INVALID_JSON);
  }

  let index = 0;
  let notEnded = true;
  let hbytesChunk = "";
  let hbytesChecked = 0;
  let preliminaryStop = false;
  let finalJson = "";

  while (index < bundle.length && notEnded) {
    const messageChunk = bundle[index].signatureMessageFragment;

    // We iterate over the message chunk, reading 9 hbytes at a time
    for (let i = 0; i < messageChunk.length; i += 9) {
      // get 9 hbytes
      const hbytes = messageChunk.slice(i, i + 9);
      hbytesChunk += hbytes;

      // Get the upper limit of the tytes that need to be checked
      // because we only check 2 hbytes at a time, there is sometimes a leftover
      const upperLimit = hbytesChunk.length - hbytesChunk.length % 2;

      const hbytesToCheck = hbytesChunk.slice(hbytesChecked, upperLimit);

      // We read 2 hbytes at a time and check if it equals the closing bracket character
      for (let j = 0; j < hbytesToCheck.length; j += 2) {
        const trytePair = hbytesToCheck[j] + hbytesToCheck[j + 1];

        // If closing bracket char was found, and there are only trailing 9's
        // we quit and remove the 9's from the hbytesChunk.
        if (preliminaryStop && trytePair === "99") {
          notEnded = false;
          // TODO: Remove the trailing 9's from hbytesChunk
          // var closingBracket = hbytesToCheck.indexOf('QD') + 1;

          // hbytesChunk = hbytesChunk.slice( 0, ( hbytesChunk.length - hbytesToCheck.length ) + ( closingBracket % 2 === 0 ? closingBracket : closingBracket + 1 ) );

          break;
        }

        finalJson += hbytesToAscii(trytePair);

        // If tryte pair equals closing bracket char, we set a preliminary stop
        // the preliminaryStop is useful when we have a nested JSON object
        if (trytePair === lastTrytePair) {
          preliminaryStop = true;
        }
      }

      if (!notEnded) {
        break;
      }

      hbytesChecked += hbytesToCheck.length;
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
