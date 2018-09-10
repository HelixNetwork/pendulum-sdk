import * as nock from 'nock'
import { ProtocolCommand, StoreTransactionsCommand } from '../../../../types'
import { bundleTrytes } from '@helix/samples'
import headers from './headers'

export const storeTransactionsCommand: StoreTransactionsCommand = {
    command: ProtocolCommand.STORE_TRANSACTIONS,
    trytes: bundleTrytes,
}

export const storeTransactionsNock = nock('http://localhost:14265', headers)
    .persist()
    .post('/', storeTransactionsCommand)
    .reply(200, {})
