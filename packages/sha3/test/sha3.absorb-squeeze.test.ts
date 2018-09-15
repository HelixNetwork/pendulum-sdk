import test from 'ava'
import Sha3 from '../src'
import { bytes, hex } from '@helixnetwork/converter'

test('SHA-3: absorb() and squeeze()', t => {
  const input =
    '964b398ecd55793d8ca93e01274efe1377a70c8dc358fdca17cb4e94a9ed7777'
  const expected =
    'c2a26a52b0da35baf172d0069cf890f47e351a184b534fffa7d9e4366532d9f9'

  const absorbSqueeze = (input: string): string => {
    const sha3: Sha3 = new Sha3();
    const inputBytes = bytes(input);
    sha3.absorb(input, 0, input.length);
    const hash = new Int8Array(Sha3.HASH_LENGTH);
    sha3.squeeze(hash, 0, Sha3.HASH_LENGTH);
    return hex(hash);
  }

  t.is(
    absorbSqueeze(input),
    expected,
    'SHA-3 should produce correct hash for absorb/squeeze case.'
  )
})
