const test = require('tape')
const b64 = require('../')
const checks = [
  'a',
  'aa',
  'aaa',
  'hi',
  'hi!',
  'hi!!',
  'sup',
  'sup?',
  'sup?!'
]

test('convert to base64 and back', function (t) {
  t.plan(checks.length * 2)

  for (let i = 0; i < checks.length; i++) {
    const check = checks[i]

    const b64Str = b64.fromByteArray(map(check, function (char) { return char.charCodeAt(0) }))

    const arr = b64.toByteArray(b64Str)
    const str = map(arr, function (byte) { return String.fromCharCode(byte) }).join('')

    t.equal(check, str, 'Checked ' + check)
    t.equal(b64.byteLength(b64Str), arr.length, 'Checked length for ' + check)
  }
})

const data = [
  [[0, 0, 0], 'AAAA'],
  [[0, 0, 1], 'AAAB'],
  [[0, 1, -1], 'AAH/'],
  [[1, 1, 1], 'AQEB'],
  [[0, -73, 23], 'ALcX']
]

test('convert known data to string', function (t) {
  for (let i = 0; i < data.length; i++) {
    const bytes = data[i][0]
    const expected = data[i][1]
    const actual = b64.fromByteArray(bytes)
    t.equal(actual, expected, 'Ensure that ' + bytes + ' serialise to ' + expected)
  }
  t.end()
})

test('convert known data from string', function (t) {
  for (let i = 0; i < data.length; i++) {
    const expected = data[i][0]
    const string = data[i][1]
    const actual = b64.toByteArray(string)
    t.ok(equal(actual, expected), 'Ensure that ' + string + ' deserialise to ' + expected)
    const length = b64.byteLength(string)
    t.equal(length, expected.length, 'Ensure that ' + string + ' has byte lentgh of ' + expected.length)
  }
  t.end()
})

function equal (a, b) {
  let i
  const length = a.length
  if (length !== b.length) return false
  for (i = 0; i < length; ++i) {
    if ((a[i] & 0xFF) !== (b[i] & 0xFF)) return false
  }
  return true
}

function map (arr, callback) {
  const res = []
  let kValue, mappedValue

  for (let k = 0, len = arr.length; k < len; k++) {
    if ((typeof arr === 'string' && !!arr.charAt(k))) {
      kValue = arr.charAt(k)
      mappedValue = callback(kValue, k, arr)
      res[k] = mappedValue
    } else if (typeof arr !== 'string' && k in arr) {
      kValue = arr[k]
      mappedValue = callback(kValue, k, arr)
      res[k] = mappedValue
    }
  }
  return res
}
