import * as Promise from 'bluebird'
import { attachedTrytesValidator } from '@helix/transaction'
import { arrayValidator, validate } from '../../guards'
import {
    BroadcastTransactionsCommand,
    BroadcastTransactionsResponse,
    Callback,
    ProtocolCommand,
    Provider,
    Trytes,
} from '../../types'

/**
 * @method createBroadcastTransactions
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {function} {@link #module_core.broadcastTransactions `broadcastTransactions`}
 */
export const createBroadcastTransactions = ({ send }: Provider) =>
    /**
     * Broadcasts an list of _attached_ transaction trytes to the network by calling
     * [`boradcastTransactions`](https://docs.iota.org/iri/api#endpoints/broadcastTransactions) command.
     * Tip selection and Proof-of-Work must be done first, by calling
     * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove} and
     * [`attachToTangle`]{@link #module_core.attachToTangle} or an equivalent attach method or remote
     * [`PoWbox`](https://powbox.testnet.iota.org/), which is a development tool.
     *
     * You may use this method to increase odds of effective transaction propagation.
     *
     * Persist the transaction trytes in local storage **before** calling this command for first time, to ensure
     * that reattachment is possible, until your bundle has been included.
     *
     * @example
     *
     * ```js
     * broadcastTransactions(trytes)
     *   .then(trytes => {
     *      // ...
     *   })
     *   .catch(err => {
     *     // ...
     *   })
     * ```
     *
     * @method broadcastTransactions
     *
     * @memberof module:core
     *
     * @param {TransactionTrytes[]} trytes - Attached Transaction trytes
     * @param {Callback} [callback] - Optional callback
     *
     * @return {Promise}
     * @fulfil {Trytes[]} Attached transaction trytes
     * @reject {Error}
     * - `INVALID_ATTACHED_TRYTES`: Invalid array of attached trytes
     * - Fetch error
     */
    (trytes: ReadonlyArray<Trytes>, callback?: Callback<ReadonlyArray<Trytes>>): Promise<ReadonlyArray<Trytes>> =>
        Promise.resolve(validate(arrayValidator<Trytes>(attachedTrytesValidator)(trytes)))
            .then(() =>
                send<BroadcastTransactionsCommand, BroadcastTransactionsResponse>({
                    command: ProtocolCommand.BROADCAST_TRANSACTIONS,
                    trytes,
                })
            )
            .then(() => trytes)
            .asCallback(callback)
