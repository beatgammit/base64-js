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

	res = some(checks, function (check) {
		var b64Str,
			arr,
			str;

		b64Str = b64.fromByteArray(map(check, function (char) { return char.charCodeAt(0); }));

		arr = b64.toByteArray(b64Str);
		str = map(arr, function (byte) { return String.fromCharCode(byte); }).join('');
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

function some (arr, fun) {
	for (var i = 0, len = arr.length; i < len; i++) {
		if (i in arr && fun(arr[i], i, arr)) {
			return true;
		}
	}
	return false;
}

function map (arr, callback) {
	var res = [];
	for (var k = 0, len = arr.length; k < len; k++) {
		if ((typeof arr === 'string' && !!arr.charAt(k))) {
			var kValue = arr.charAt(k);
			var mappedValue = callback(kValue, k, arr);
			res[k] = mappedValue;
		} else if (typeof arr !== 'string' && k in arr) {
			var kValue = arr[k];
			var mappedValue = callback(kValue, k, arr);
			res[k] = mappedValue;
		}
	}
	return res;
}