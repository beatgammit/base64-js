import test from 'tape'
import { toByteArray, byteLength } from '../index.js'

test('padding bytes found inside base64 string', function (t) {
  // See https://github.com/beatgammit/base64-js/issues/42
  const str = 'SQ==QU0='
  t.deepEqual(toByteArray(str), new Uint8Array([73]))
  t.equal(byteLength(str), 1)
  t.end()
})
