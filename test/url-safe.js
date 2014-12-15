var test = require('tape'),
  b64 = require('../lib/b64');

test('decode url-safe style base64 strings', function (t) {
  var expected = [0xff, 0xff, 0xbe, 0xff, 0xef, 0xbf, 0xfb, 0xef, 0xff];
  
  t.deepEqual(b64.toByteArray('//++/++/++//'), expected);
  t.deepEqual(b64.toByteArray('__--_--_--__'), expected);
  
  t.end();
});
