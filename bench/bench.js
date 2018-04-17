var base64 = require('../')
var benchmark = require('benchmark')

var suite = new benchmark.Suite()
var random = require('crypto').pseudoRandomBytes
var data = random(1e6).toString('base64')
var raw = base64.toByteArray(data)

suite
  .add('base64.toByteArray() (decode)', function () {
    var raw2 = base64.toByteArray(data) // eslint-disable-line no-unused-vars
  })
  .add('base64.fromByteArray() (encode)', function () {
    var data2 = base64.fromByteArray(raw) // eslint-disable-line no-unused-vars
  })
  .add('base64.byteLength() (encode)', function () {
    var len = base64.byteLength(data) // eslint-disable-line no-unused-vars
  })
  .on('error', function (event) {
    console.error(event.target.error.stack)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: true })
