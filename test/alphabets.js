var test = require('tape')
var b64 = require('../')

test('unknown alphabet', function (t) {
  try {
    b64.fromByteArray([], 'bogus')
  } catch (err) {
    t.equal(err.message, 'Unknown alphabet bogus')
    t.end()
  }
})

test('custom alphabets', function (t) {
  b64.alphabets.custom = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?'
  var a = b64.toByteArray('aa+/')
  var b = b64.fromByteArray(a, 'custom')
  t.deepEqual(b, 'aa!?')
  t.end()
})
