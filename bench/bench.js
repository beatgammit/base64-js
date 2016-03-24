var base64 = require('../')
var benchmark = require('benchmark')

var randomBytes = require('crypto').randomBytes
var XorShift128Plus = require('xorshift.js').XorShift128Plus

var seed = process.env.SEED || randomBytes(16).toString('hex')
console.log('SEED: ' + seed)
var prng = new XorShift128Plus(seed)
var data = prng.randomBytes(1e6).toString('base64')
var raw = base64.toByteArray(data)

new benchmark.Suite()
  .add('base64.toByteArray() (decode)', function () {
    var raw2 = base64.toByteArray(data) // eslint-disable-line no-unused-vars
  })
  .add('base64.fromByteArray() (encode)', function () {
    var data2 = base64.fromByteArray(raw) // eslint-disable-line no-unused-vars
  })
  .on('error', function (event) {
    console.error(event.target.error.stack)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: true })
