import * as nock from 'nock'
import { ProtocolCommand, AttachToTangleCommand, AttachToTangleResponse } from '../../../../types'
import { bundle, bundleTrytes } from '@helix/samples'
import headers from './headers'

export const attachToTangleCommand: AttachToTangleCommand = {
    command: ProtocolCommand.ATTACH_TO_TANGLE,
    trunkTransaction: bundle[bundle.length - 1].trunkTransaction,
    branchTransaction: bundle[bundle.length - 1].branchTransaction,
    minWeightMagnitude: 14,
    trytes: [...bundleTrytes].reverse(),
}

export const attachToTangleResponse: AttachToTangleResponse = {
    trytes: bundleTrytes,
}

export const attachToTangleNock = nock('http://localhost:14265', headers)
    .persist()
    .post('/', attachToTangleCommand)
    .reply(200, attachToTangleResponse)
