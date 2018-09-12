import * as Promise from 'bluebird'
import { transactionHashValidator } from '@helixnetwork/transaction'
import { INVALID_REFERENCE_HASH } from '../../errors'
import { depthValidator, validate } from '../../guards'
import {
    Callback,
    GetTransactionsToApproveCommand,
    GetTransactionsToApproveResponse,
    Hash,
    ProtocolCommand,
    TransactionsToApprove,
    Provider,
} from '../../types'

/**
 * @method createGetTransactionsToApprove
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {function} {@link #module_core.getTransactionsToApprove `getTransactionsToApprove`}
 */
export const createGetTransactionsToApprove = ({ send }: Provider) =>
    /**
     * Does the _tip selection_ by calling
     * [`getTransactionsToApprove`](https://docs.iota.works/iri/api#endpoints/getTransactionsToApprove) command.
     * Returns a pair of approved transactions, which are chosen randomly after validating the transaction trytes,
     * the signatures and cross-checking for conflicting transactions.
     *
     * Tip selection is executed by a Random Walk (RW) starting at random point in given `depth`
     * ending up to the pair of selected tips. For more information about tip selection please refer to the
     * [whitepaper](http://iotatoken.com/IOTA_Whitepaper.pdf).
     *
     * The `reference` option allows to select tips in a way that the reference transaction is being approved too.
     * This is useful for promoting transactions, for example with
     * [`promoteTransaction`]{@link #module_core.promoteTransaction}.
     *
     * @example
     *
     * ```js
     * const depth = 3
     * const minWeightMagnitude = 14
     *
     * getTransactionsToApprove(depth)
     *   .then(transactionsToApprove =>
     *      attachToTanle(minWightMagnitude, trytes, { transactionsToApprove })
     *   )
     *   .then(storeAndBroadcast)
     *   .catch(err => {
     *     // handle errors here
     *   })
     * ```
     *
     * @method getTransactionsToApprove
     *
     * @memberof module:core
     *
     * @param {number} depth - The depth at which Random Walk starts. A value of `3` is typically used by wallets,
     * meaning that RW starts 3 milestones back.
     * @param {Hash} [reference] - Optional reference transaction hash
     * @param {Callback} [callback] - Optional callback
     *
     * @return {Promise}
     * @fulfil {trunkTransaction, branchTransaction} A pair of approved transactions
     * @reject {Error}
     * - `INVALID_DEPTH`
     * - `INVALID_REFERENCE_HASH`: Invalid reference hash
     * - Fetch error
     */
    function attachToTangle(
        depth: number,
        reference?: Hash,
        callback?: Callback<TransactionsToApprove>
    ): Promise<TransactionsToApprove> {
        return Promise.resolve(
            validate(depthValidator(depth), !!reference && transactionHashValidator(reference, INVALID_REFERENCE_HASH))
        )
            .then(() =>
                send<GetTransactionsToApproveCommand, GetTransactionsToApproveResponse>({
                    command: ProtocolCommand.GET_TRANSACTIONS_TO_APPROVE,
                    depth,
                    reference,
                })
            )
            .then(({ trunkTransaction, branchTransaction }: GetTransactionsToApproveResponse) => ({
                trunkTransaction,
                branchTransaction,
            }))
            .asCallback(typeof arguments[1] === 'function' ? arguments[1] : callback)
    }
