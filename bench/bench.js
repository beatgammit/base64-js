import { toByteArray, fromByteArray, byteLength } from '../index.js'
import { randomBytes as random } from 'crypto'
import { Suite } from 'benchmark'

const suite = new Suite()
const data = random(1e6).toString('base64')
const raw = toByteArray(data)

suite
  .add('base64.toByteArray() (decode)', function () {
    const raw2 = toByteArray(data) // eslint-disable-line no-unused-vars
  })
  .add('base64.fromByteArray() (encode)', function () {
    const data2 = fromByteArray(raw) // eslint-disable-line no-unused-vars
  })
  .add('base64.byteLength() (encode)', function () {
    const len = byteLength(data) // eslint-disable-line no-unused-vars
  })
  .on('error', function (event) {
    console.error(event.target.error.stack)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: true })
