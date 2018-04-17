var random = require('crypto').pseudoRandomBytes

var b64 = require('../')
var data = random(1e6).toString('base64')
var start = Date.now()
var raw = b64.toByteArray(data)
var middle1 = Date.now()
data = b64.fromByteArray(raw)
var middle2 = Date.now()
var len = b64.byteLength(data)
var end = Date.now()

console.log(
  'decode ms, decode ops/ms, encode ms, encode ops/ms, length ms, length ops/ms'
)
console.log(
  middle1 - start, data.length / (middle1 - start),
  middle2 - middle1, data.length / (middle2 - middle1),
  end - middle2, len / (end - middle2)
)
