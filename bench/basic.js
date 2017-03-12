var randomBytes = require('crypto').randomBytes
var XorShift128Plus = require('xorshift.js').XorShift128Plus

var seed = process.env.SEED || randomBytes(16).toString('hex')
console.log('SEED: ' + seed)
var prng = new XorShift128Plus(seed)

var b64 = require('../')
var data = prng.randomBytes(1e6).toString('base64')
var start = Date.now()
var raw = b64.toByteArray(data)
var middle = Date.now()
data = b64.fromByteArray(raw)
var end = Date.now()

console.log('decode ms, decode ops/ms, encode ms, encode ops/ms')
console.log(
  middle - start, data.length / (middle - start),
  end - middle, data.length / (end - middle))
