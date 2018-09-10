import * as nock from 'nock'
import { ProtocolCommand, GetTipsCommand, GetTipsResponse } from '../../../../types'
import headers from './headers'

export const getTipsCommand: GetTipsCommand = {
    command: ProtocolCommand.GET_TIPS,
}

export const getTipsResponse: GetTipsResponse = {
    hashes: ['T'.repeat(81), 'U'.repeat(81)],
    duration: 10,
}

export const getBalancesNock = nock('http://localhost:14265', headers)
    .persist()
    .post('/', getTipsCommand)
    .reply(200, getTipsResponse)
