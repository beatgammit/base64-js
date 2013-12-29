(function (exports) {
  'use strict';

  var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  function decode (c) {
    return indexOf(lookup, c)
  }

  function b64ToByteArray(b64) {
    var i, j, l, tmp, placeHolders, arr;
  
    if (b64.length % 4 > 0) {
      throw 'Invalid string. Length must be a multiple of 4';
    }

    // the number of equal signs (place holders)
    // if there are two placeholders, than the two characters before it
    // represent one byte
    // if there is only one, then the three characters before it represent 2 bytes
    // this is just a cheap hack to not do indexOf twice
    placeHolders = indexOf(b64, '=');
    placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

    // base64 is 4/3 + up to two characters of the original data
    arr = new Uint8Array(b64.length * 3 / 4 - placeHolders);

    // if there are placeholders, only get up to the last complete 4 chars
    l = placeHolders > 0 ? b64.length - 4 : b64.length;

    var L = 0

    function push (v) {
      arr[L++] = v
    }

    for (i = 0, j = 0; i < l; i += 4, j += 3) {
      tmp = (decode(b64.charAt(i)) << 18) | (indexOf(lookup, b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3));
      push((tmp & 0xFF0000) >> 16);
      push((tmp & 0xFF00) >> 8);
      push(tmp & 0xFF);
    }

    if (placeHolders === 2) {
      tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4);
      push(tmp & 0xFF);
    } else if (placeHolders === 1) {
      tmp = (indexOf(lookup, b64.charAt(i)) << 10) | (indexOf(lookup, b64.charAt(i + 1)) << 4) | (indexOf(lookup, b64.charAt(i + 2)) >> 2);
      push((tmp >> 8) & 0xFF);
      push(tmp & 0xFF);
    }

    return arr;
  }

  function uint8ToBase64(uint8) {
    var i,
      extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
      output = "",
      temp, length;

    function tripletToBase64 (num) {
      return lookup.charAt(num >> 18 & 0x3F) + lookup.charAt(num >> 12 & 0x3F) + lookup.charAt(num >> 6 & 0x3F) + lookup.charAt(num & 0x3F);
    };

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
      temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
      output += tripletToBase64(temp);
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    switch (extraBytes) {
      case 1:
        temp = uint8[uint8.length - 1];
        output += lookup.charAt(temp >> 2);
        output += lookup.charAt((temp << 4) & 0x3F);
        output += '==';
        break;
      case 2:
        temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
        output += lookup.charAt(temp >> 10);
        output += lookup.charAt((temp >> 4) & 0x3F);
        output += lookup.charAt((temp << 2) & 0x3F);
        output += '=';
        break;
    }

    return output;
  }

  module.exports.toByteArray = b64ToByteArray;
  module.exports.fromByteArray = uint8ToBase64;
}());

function indexOf (arr, elt /*, from*/) {
  var len = arr.length;

  var from = Number(arguments[1]) || 0;
  from = (from < 0)
    ? Math.ceil(from)
    : Math.floor(from);
  if (from < 0)
    from += len;

  for (; from < len; from++) {
    if ((typeof arr === 'string' && arr.charAt(from) === elt) ||
        (typeof arr !== 'string' && arr[from] === elt)) {
      return from;
    }
  }
  return -1;
}
