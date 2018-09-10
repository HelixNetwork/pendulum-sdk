import test from 'ava'
import { trytes } from '@helix/samples'
import { isTrytesArray } from '../src'

test('isTrytesArray()', t => {
    const invalidTrytes = [
        'JALLWDUOSTSJVL9EEHKW9YQFPBVBJAGLNKRVGSQZCGHQWEMIIILJMTHVAGVDXJVZMBAMOZTSBQNRVNLLSJMPIVGPNE',
        'fdsafBCDWDUOSTSJEEHKW9YQFPBVBJAGLNKRVGSQZCGHQWEMIIILJMTHVAGVDXJVZMBAMOZTSBQRVNLLSJ',
    ]

    t.deepEqual(isTrytesArray(trytes), true, 'isTrytesArray() returns true for valid trytes')

    t.deepEqual(isTrytesArray(invalidTrytes), false, 'isTrytesArray() return false for invalid trytes')
})
