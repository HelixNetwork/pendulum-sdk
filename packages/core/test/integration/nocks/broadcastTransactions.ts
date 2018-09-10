import * as nock from 'nock'
import { ProtocolCommand, BroadcastTransactionsCommand } from '../../../../types'
import { bundleTrytes } from '@helix/samples'
import headers from './headers'

export const broadcastTransactionsCommand: BroadcastTransactionsCommand = {
    command: ProtocolCommand.BROADCAST_TRANSACTIONS,
    trytes: bundleTrytes,
}

export const broadcastTransactionsNock = nock('http://localhost:14265', headers)
    .persist()
    .post('/', broadcastTransactionsCommand)
    .reply(200, {})
