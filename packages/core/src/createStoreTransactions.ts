import { attachedTrytesValidator } from '@helix/transaction'
import * as Promise from 'bluebird'
import { arrayValidator, validate } from '../../guards'
import {
    Callback,
    ProtocolCommand,
    Provider,
    StoreTransactionsCommand,
    StoreTransactionsResponse,
    Trytes,
} from '../../types'

/**
 * @method createStoreTransactions
 *
 * @memberof module:core
 *
 * @param {Provider} provider - Network provider
 *
 * @return {function} {@link #module_core.storeTransactions `storeTransactions`}
 */
export const createStoreTransactions = ({ send }: Provider) =>
    /**
     * @description Persists a list of _attached_ transaction trytes in the store of connected node by calling
     * [`storeTransactions`](https://docs.iota.org/iri/api#endpoints/storeTransactions) command.
     * Tip selection and Proof-of-Work must be done first, by calling
     * [`getTransactionsToApprove`]{@link #module_core.getTransactionsToApprove} and
     * [`attachToTangle`]{@link #module_core.attachToTangle} or an equivalent attach method or remote
     * [`PoWbox`](https://powbox.devnet.iota.org/).
     *
     * Persist the transaction trytes in local storage **before** calling this command, to ensure
     * reattachment is possible, until your bundle has been included.
     *
     * Any transactions stored with this command will eventaully be erased, as a result of a snapshot.
     *
     * @method storeTransactions
     *
     * @memberof module:core
     *
     * @param {Trytes[]} trytes - Attached transaction trytes
     * @param {Callback} [callback] - Optional callback
     *
     * @return {Promise}
     * @fullfil {Trytes[]} Attached transaction trytes
     * @reject {Error}
     * - `INVALID_ATTACHED_TRYTES`: Invalid attached trytes
     * - Fetch error
     */
    (trytes: ReadonlyArray<Trytes>, callback?: Callback<ReadonlyArray<Trytes>>): Promise<ReadonlyArray<Trytes>> =>
        Promise.resolve(validate(arrayValidator(attachedTrytesValidator)(trytes)))
            .then(() =>
                send<StoreTransactionsCommand, StoreTransactionsResponse>({
                    command: ProtocolCommand.STORE_TRANSACTIONS,
                    trytes,
                })
            )
            .then(() => trytes)
            .asCallback(callback)
