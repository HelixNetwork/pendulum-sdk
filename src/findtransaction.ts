import { composeAPI } from "@helix/core";
import * as config from "./config";

/**
 * API to invoke findTransactions using composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * It allows to search for transactions by passing a `query` object with `addresses`, `tags` and `approvees` fields.
 * Multiple query fields are supported and `findTransactions` returns intersection of results.
 *
 * @param {Provider} provider - Network provider
 *
 * @example sample output
 * [ 'TSTJHVQLELHLACTOVMNOICW9NNLTCRDRCMDBETJZVSPRNUGZMHDSKKJPQXLAVRQHJASNRAXZUMNTKC999',
 * 'RHTXGNJAYKFDYOVFSGSRHO9XWFDVTSOEWSOFQRWKQILGPLDPWDJLGNPLRRGUBQCUURDEMZALFMRSAA999' ]
 *
 *
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 *
 * @method findTransactions
 *
 *
 * @param {Hash[]} [addresses] - List of addresses
 * @param {Hash[]} [bundles] - List of bundle hashes
 * @param {Tag[]} [tags] - List of tags
 * @returns {Promise}
 * @fulfil {Hash[]} Array of transaction hashes
 * @reject {Error}
 * - `INVALID_SEARCH_KEY`
 * - `INVALID_HASH`: Invalid bundle hash
 * - `INVALID_TRANSACTION_HASH`: Invalid approvee transaction hash
 * - `INVALID_ADDRESS`: Invalid address
 * - `INVALID_TAG`: Invalid tag
 * - Fetch error
 */

export const findTransactions = (
  address: string[],
  bundles: string[],
  tag: string[]
): Promise<any> => {
  return helix.findTransactions({
    addresses: address,
    bundles,
    tags: tag
  });
};
