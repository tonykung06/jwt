var config = require('../configs/server.config.js');
var jwt = require('jwt-simple');

var secret = config.tokenSecret;

var jobs = [
	'Cook',
	'SuperHero',
	'Job3',
	'Job4'
];

module.exports = function(req, res) {
	if (!req.headers.authorization) {
		return res.status(401).send({
			message: 'You are not authorized.'
		});
	}

	var token = req.headers.authorization.split(' ')[1];
	var payload = jwt.decode(token, secret);

	if (!payload || !payload.sub) {
		return res.status(401).send({
			message: 'Authentication failed'
		});
	}

	res.json(jobs);
};