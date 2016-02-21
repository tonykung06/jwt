var crypto = require('crypto');

function sign(value, secret) {
	return crypto.createHmac('sha256', secret).update(value).digest('base64');
}

function base64Encode(value) {
	return new Buffer(value).toString('base64');
}

function base64Decode(value) {
	return new Buffer(value, 'base64').toString();
}

function verifySignature(source, target, secret) {
	return sign(source, secret) === target;
}

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


exports.decode = function(token, secret) {
	var segments = token.split('.');

	if (segments.length !== 3) {
		throw new Error('Token structure incorrect');
	}

	var header = JSON.parse(base64Decode(segments[0]));
	var payload = JSON.parse(base64Decode(segments[1]));

	if (!verifySignature(segments[0] + '.' + segments[1], segments[2], secret)) {
		throw new Error('Token verification failed');
	}

	return payload;
};