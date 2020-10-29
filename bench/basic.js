const random = require('crypto').randomBytes

const b64 = require('../')
let data = random(1e6).toString('base64')
const start = Date.now()
const raw = b64.toByteArray(data)
const middle1 = Date.now()
data = b64.fromByteArray(raw)
const middle2 = Date.now()
const len = b64.byteLength(data)
const end = Date.now()

console.log(
  'decode ms, decode ops/ms, encode ms, encode ops/ms, length ms, length ops/ms'
)
console.log(
  middle1 - start,
  data.length / (middle1 - start),
  middle2 - middle1,
  data.length / (middle2 - middle1),
  end - middle2,
  len / (end - middle2)
)
