import * as nock from 'nock'
import {
    WereAddressesSpentFromCommand,
    WereAddressesSpentFromResponse,
} from '../../../src/createWereAddressesSpentFrom'
import { ProtocolCommand } from '../../../../types'
import headers from './headers'

import { addresses } from '@helixnetwork/samples'

export const wereAddressesSpentFromCommand: WereAddressesSpentFromCommand = {
    command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
    addresses,
}

export const wereAddressesSpentFromResponse: WereAddressesSpentFromResponse = {
    states: [true, false, false],
}

export const wereAddressesSpentFromNock = nock('http://localhost:14265', headers)
    .persist()
    .post('/', wereAddressesSpentFromCommand)
    .reply(200, wereAddressesSpentFromResponse)

nock('http://localhost:14265', headers)
    .persist()
    .post('/', {
        command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
        addresses: ['FJHSSHBZTAKQNDTIKJYCZBOZDGSZANCZSWCNWUOCZXFADNOQSYAHEJPXRLOVPNOQFQXXGEGVDGICLMOXX'],
    })
    .reply(200, {
        states: [true],
    })

nock('http://localhost:14265', headers)
    .persist()
    .post('/', {
        command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
        addresses: ['9DZXPFSVCSSWXXQPFMWLGFKPBAFTHYMKMZCPFHBVHXPFNJEIJIEEPKXAUBKBNNLIKWHJIYQDFWQVELOCB'],
    })
    .reply(200, {
        states: [false],
    })

nock('http://localhost:14265', headers)
    .persist()
    .post('/', {
        command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
        addresses: ['OTSZGTNPKFSGJLUPUNGGXFBYF9GVUEHOADZZTDEOJPWNEIVBLHOMUWPILAHTQHHVSBKTDVQIAEQOZXGFB'],
    })
    .reply(200, {
        states: [false],
    })

nock('http://localhost:14265', headers)
    .persist()
    .post('/', {
        command: ProtocolCommand.WERE_ADDRESSES_SPENT_FROM,
        addresses: [
            '9DZXPFSVCSSWXXQPFMWLGFKPBAFTHYMKMZCPFHBVHXPFNJEIJIEEPKXAUBKBNNLIKWHJIYQDFWQVELOCB',
            'OTSZGTNPKFSGJLUPUNGGXFBYF9GVUEHOADZZTDEOJPWNEIVBLHOMUWPILAHTQHHVSBKTDVQIAEQOZXGFB',
        ],
    })
    .reply(200, {
        states: [false, false],
    })
