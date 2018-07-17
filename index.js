'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len & 3) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  // 0 to 3 characters of padding so total length is a multiple of 4
  var placeHoldersLen = 3 - ((validLen + 3) & 3)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return _byteLength(validLen, placeHoldersLen)
}

function _byteLength (validLen, placeHoldersLen) {
  return (((validLen + placeHoldersLen) * 3) >> 2) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      revLookup[b64.charCodeAt(i)] << 18 |
      revLookup[b64.charCodeAt(i + 1)] << 12 |
      revLookup[b64.charCodeAt(i + 2)] << 6 |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = tmp >> 16 & 0xFF
    arr[curByte++] = tmp >> 8 & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    arr[curByte] =
      revLookup[b64.charCodeAt(i)] << 2 |
      revLookup[b64.charCodeAt(i + 1)] >> 4
  } else if (placeHoldersLen === 1) {
    tmp =
      revLookup[b64.charCodeAt(i)] << 10 |
      revLookup[b64.charCodeAt(i + 1)] << 4 |
      revLookup[b64.charCodeAt(i + 2)] >> 2
    arr[curByte++] = tmp >> 8 & 0xFF
    arr[curByte] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = new Array((end - start) / 3)
  for (var i = start, curTriplet = 0; i < end; i += 3) {
    tmp =
      (uint8[i] & 0xFF) << 16 |
      (uint8[i + 1] & 0xFF) << 8 |
      (uint8[i + 2] & 0xFF)
    output[curTriplet++] = tripletToBase64(tmp)
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var len2 = len - extraBytes
  var maxChunkLength = 16383 // must be multiple of 3
  var parts = new Array(Math.ceil(len2 / maxChunkLength))

  var curChunk = 0

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, nextI; i < len2; i = nextI) {
    nextI = i + maxChunkLength
    parts[curChunk++] = encodeChunk(uint8, i, Math.min(nextI, len2))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1] & 0xFF
    parts[curChunk] =
      lookup[tmp >> 2] +
      lookup[tmp << 4 & 0x3F] +
      '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] & 0xFF) << 8 | (uint8[len - 1] & 0xFF)
    parts[curChunk] =
      lookup[tmp >> 10] +
      lookup[tmp >> 4 & 0x3F] +
      lookup[tmp << 2 & 0x3F] +
      '='
  }

  return parts.join('')
}
