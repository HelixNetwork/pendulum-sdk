import test from 'ava'
import { getKeysToBatch, BatchableCommand } from '../src/httpClient'
import { FindTransactionsCommand, ProtocolCommand } from '../../types'

const BATCH_SIZE = 2

const tags: string[] = ['A' + '9'.repeat(26), 'B' + '9'.repeat(26), 'C' + '9'.repeat(26)]

const approvees: string[] = ['A'.repeat(81), 'B'.repeat(81), 'C'.repeat(81)]

const command: FindTransactionsCommand = {
    command: ProtocolCommand.FIND_TRANSACTIONS,
    addresses: ['9'.repeat(81)],
    tags,
    approvees,
}

const commandWithoutBatchableKeys: FindTransactionsCommand = {
    command: ProtocolCommand.FIND_TRANSACTIONS,
    addresses: ['A'.repeat(81), 'B'.repeat(81)],
}

test('getKeysToBatch() should return correct keys.', t => {
    t.deepEqual(getKeysToBatch(<BatchableCommand<FindTransactionsCommand>>command, BATCH_SIZE), ['tags', 'approvees'])
})

test('getKeysToBatch() should return no empty array for non-batchable keys.', t => {
    t.deepEqual(getKeysToBatch(<BatchableCommand<FindTransactionsCommand>>commandWithoutBatchableKeys, BATCH_SIZE), [])
})
