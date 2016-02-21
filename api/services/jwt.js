var crypto = require('crypto');

exports.encode = function(payload, secret) {
	var algorithm = 'HS256';
	var header = {
		typ: 'JWT',
		alg: algorithm
	};

	var jwt = base64Encode(JSON.stringify(header)) + '.' + base64Encode(JSON.stringify(payload));
	jwt += '.' + sign(jwt, secret);

	return jwt;
};

function sign(value, secret) {
	return crypto.createHmac('sha256', secret).update(value).digest('base64');
}

function base64Encode(value) {
	return new Buffer(value).toString('base64');
}