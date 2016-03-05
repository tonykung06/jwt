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
var googleAuth = require('./services/googleAuth.js');
var emailVerification = require('./services/emailVerification.js');
var createSendToken = require('./helpers/createSendToken.js');
var LocalStrategy = require('./services/localStrategy.js');
var jobs = require('./services/jobs.js');

var secret = config.tokenSecret;

var app = express();

app.use(bodyParser.json());
app.use(passport.initialize());

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.use('local-register', LocalStrategy.register);
passport.use('local-login', LocalStrategy.login);

//enabling CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	next();
});

app.post('/register', passport.authenticate('local-register'), function(req, res) {
	emailVerification.send(req.user.email, res);
	createSendToken(req.user, res);
});

app.get('/auth/verifyEmail', emailVerification.handler);

app.post('/login', passport.authenticate('local-login'), function(req, res) {
	createSendToken(req.user, res);
});

app.post('/auth/facebook', facebookAuth);

app.get('/jobs', jobs);

app.post('/auth/google', googleAuth);

mongoose.connect('mongodb://localhost/jwt');

var server = app.listen(3000, function() {
	console.log('api listening on', server.address().port);
});