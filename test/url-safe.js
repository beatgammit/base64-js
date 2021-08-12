import test from 'tape'
import { toByteArray, byteLength } from '../index.js'

test('decode url-safe style base64 strings', function (t) {
  const expected = [0xff, 0xff, 0xbe, 0xff, 0xef, 0xbf, 0xfb, 0xef, 0xff]

  let str = '//++/++/++//'
  let actual = toByteArray(str)
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  t.equal(byteLength(str), actual.length)

  str = '__--_--_--__'
  actual = toByteArray(str)
  for (let i = 0; i < actual.length; i++) {
    t.equal(actual[i], expected[i])
  }

  t.equal(byteLength(str), actual.length)

  t.end()
})
