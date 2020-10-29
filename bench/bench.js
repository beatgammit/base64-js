const base64 = require('../')
const benchmark = require('benchmark')

const suite = new benchmark.Suite()
const random = require('crypto').randomBytes
const data = random(1e6).toString('base64')
const raw = base64.toByteArray(data)

suite
  .add('base64.toByteArray() (decode)', function () {
    const raw2 = base64.toByteArray(data) // eslint-disable-line no-unused-vars
  })
  .add('base64.fromByteArray() (encode)', function () {
    const data2 = base64.fromByteArray(raw) // eslint-disable-line no-unused-vars
  })
  .add('base64.byteLength() (encode)', function () {
    const len = base64.byteLength(data) // eslint-disable-line no-unused-vars
  })
  .on('error', function (event) {
    console.error(event.target.error.stack)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: true })
