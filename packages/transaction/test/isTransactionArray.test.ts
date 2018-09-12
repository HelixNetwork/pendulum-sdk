import test from 'ava'
import { invalidTransactionObject, transactionObject } from '@helixnetwork/samples'
import { isTransactionArray } from '../src'

test('isTransactionArray() returns true for valid trasnaction array.', t => {
    t.is(isTransactionArray([transactionObject]), true, 'isTransactionsArray() returns for valid transaction array.')
})

test('isTransactionArray() returns false for invalid transaction array.', t => {
    t.is(
        isTransactionArray([invalidTransactionObject]),
        false,
        'isTransactionsArray() returns false for invalid transaction array.'
    )
})
