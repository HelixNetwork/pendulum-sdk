import { composeAPI } from "@helix/core";
import * as config from "./config";
/**
 * API for getting the info about connected node using composer
 *
 * @author Sachu Shaji Abraham <sachu.shaji@netobjex.com>
 *
 * @param {Provider} provider - Network provider
 *
 * @example sample output
 * {
 *   "appName": "HCP",
 *   "appVersion": "0.2.2.3",
 *   "duration": 1,
 *   "jreAvailableProcessors": 4,
 *   "jreFreeMemory": 91707424,
 *   "jreMaxMemory": 1908932608,
 *   "jreTotalMemory": 122683392,
 *   "latestMilestone": "VBVEUQYE99LFWHDZRFKTGFHYGDFEAMAEBGUBTTJRFKHCFBRTXFAJQ9XIUEZQCJOQTZNOOHKUQIKOY9999",
 *   "latestMilestoneIndex": 123,
 *   "latestSolidSubtangleMilestone": "VBVEUQYE99LFWHDZRFKTGFHYGDFEAMAEBGUBTTJRFKHCFBRTXFAJQ9XIUEZQCJOQTZNOOHKUQIKOY9999",
 *   "latestSolidSubtangleMilestoneIndex": 123,
 *   "neighbors": 4,
 *   "packetsQueueSize": 0,
 *  "time": 1477037811737,
 *   "tips": 333,
 *   "transactionsToRequest": 0
 * }
 */

const helix: any = composeAPI({
  provider: config.provider
});

/**
 *
 * @method getNodeInfo
 *
 * @return {Promise}
 * @fulfil {NodeInfo} Object with information about connected node.
 * @reject {Error}
 * - Fetch error
 */

export const getNodeInfo = helix.getNodeInfo();
