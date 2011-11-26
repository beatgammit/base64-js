(function () {
	'use strict';

	var b64 = require('../lib/b64'),
		checks = [
			'a',
			'aa',
			'aaa',
			'hi',
			'hi!',
			'hi!!',
			'sup',
			'sup?',
			'sup?!'
		],
		res;

	res = checks.some(function (check) {
		var b64Str,
			arr,
			str;

		b64Str = b64.fromByteArray(Array.prototype.map.call(check, function (char) { return char.charCodeAt(0); }));

		arr = b64.toByteArray(b64Str);
		str = arr.map(function (byte) { return String.fromCharCode(byte); }).join('');
		if (check !== str) {
			console.log('Fail:', check);
			console.log('Base64:', b64Str);
			return true;
		}
	});

	if (res) {
		console.log('Test failed');
	} else {
		console.log('All tests passed!');
	}
}());
