var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User.js');
// var jwt = require('./services/jwt.js');
var jwt = require('jwt-simple');
var secret = 'haha...';

var app = express();

app.use(bodyParser.json());

//enabling CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	next();
});

function createSendToken(user, res) {
	var payload = {
		// iss: req.hostname,
		sub: user.id
	};

	var token = jwt.encode(payload, secret);

	res.status(200).json({
		user: user,
		token: token
	});
}

app.post('/register', function(req, res) {
	var user = req.body;
	var newUser = new User({
		email: user.email,
		password: user.password
	});

	newUser.save(function(err) {
		createSendToken(newUser, res);
	});
});

app.post('/login', function(req, res) {
	req.user = req.body;

	User.findOne({
		email: req.user.email
	}, function(err, user) {
		if (err) {
			throw err;
		}

		if (!user) {
			return res.status(401).send({
				message: 'Wrong email/password'
			});
		}

		user.comparePasswords(req.user.password, function(err, isMatch) {
			if (err) {
				throw err;
			}

			if (!isMatch) {
				return res.status(401).send({
					message: 'Wrong email/password'
				});
			}

			createSendToken(user, res);
		});
	});
});

var jobs = [
	'Cook',
	'SuperHero',
	'Job3',
	'Job4'
];

app.get('/jobs', function(req, res) {
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
});

mongoose.connect('mongodb://localhost/jwt');

var server = app.listen(3000, function() {
	console.log('api listening on', server.address().port);
});