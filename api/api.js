var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User.js');
// var jwt = require('./services/jwt.js');
var jwt = require('jwt-simple');
var passport = require('passport');
var request = require('request');
var config = require('./configs/server.config.js');
var facebookAuth = require('./services/facebookAuth.js');
var LocalStrategy = require('passport-local').Strategy;
var createSendToken = require('./helpers/createSendToken.js');

var secret = config.tokenSecret;

var app = express();

app.use(bodyParser.json());
app.use(passport.initialize());

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

var strategyOpts = {
	usernameField: 'email'
};
var loginStrategy = new LocalStrategy(strategyOpts, function(email, password, done) {
	User.findOne({
		email: email
	}, function(err, user) {
		if (err) {
			return done(err);
		}

		if (!user) {
			return done(null, false, {
				message: 'Wrong email/password' //not used in passport-strategy yet
			});
		}

		user.comparePasswords(password, function(err, isMatch) {
			if (err) {
				return done(err);
			}

			if (!isMatch) {
				return done(null, false, {
					message: 'Wrong email/password'
				});
			}

			done(null, user);
		});
	});
});

var registerStrategy = new LocalStrategy(strategyOpts, function(email, password, done) {
	User.findOne({
		email: email
	}, function(err, user) {
		if (err) {
			return done(err);
		}

		if (user) {
			return done(null, false, {
				message: 'email already exists' //not used in passport-strategy yet
			});
		}

		var newUser = new User({
			email: email,
			password: password
		});

		newUser.save(function(err) {
			if (err) {
				return done(err);
			}
			
			done(null, newUser);
		});
	});
});

passport.use('local-register', registerStrategy);
passport.use('local-login', loginStrategy);

//enabling CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	next();
});

app.post('/register', passport.authenticate('local-register'), function(req, res) {
	createSendToken(req.user, res);
});

app.post('/login', passport.authenticate('local-login'), function(req, res) {
	createSendToken(req.user, res);
});

app.post('/auth/facebook', facebookAuth);

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

app.post('/auth/google', function(req, res) {
	var url = 'https://www.googleapis.com/oauth2/v4/token';
	var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
	var params = {
		client_id: req.body.clientId,
		redirect_uri: req.body.redirectUri,
		code: req.body.code,
		grant_type: 'authorization_code',
		client_secret: config.googleAuth.secret
	};

	request.post(url, {
		json: true,
		form: params
	}, function(err, response, body) {
		var accessToken = body.access_token;
		var headers = {
			Authorization: 'Bearer ' + accessToken
		};

		request.get({
			url: apiUrl,
			headers: headers,
			json: true
		}, function(err, response, body) {
			var profile = body;

			User.findOne({
				googleId: profile.sub
			}, function(err, foundUser) {
				if (foundUser) {
					return createSendToken(foundUser, res);
				}

				var newUser = new User();
				newUser.googleId = profile.sub;
				newUser.displayName = profile.name;
				newUser.save(function(err) {
					if (err) {
						// return next(err);
						return res.status(401).send({
							message: 'You are not authorized.'
						});
					}

					createSendToken(newUser, res);
				});
			});
		});
	});
});

mongoose.connect('mongodb://localhost/jwt');

var server = app.listen(3000, function() {
	console.log('api listening on', server.address().port);
});