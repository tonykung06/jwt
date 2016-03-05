var config = require('../configs/server.config.js');
var jwt = require('jwt-simple');
var _ = require('underscore');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var User = require('../models/User.js');

var defaultModel = {
	verifyUrl: 'http://localhost:3000/auth/verifyEmail?token=',
	title: 'jsonwebtoken',
	subTitle: 'Thanks for signing up!',
	body: 'Please verify your email address by clicking the button below.'
};

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var secret = config.emailSecret;

var getHtml = function (token) {
	var path = './views/emailVerification.html';
	var html = fs.readFileSync(path, encoding = 'utf8');
	var template = _.template(html);
	var model = _.clone(defaultModel);

	model.verifyUrl += token;

	return template(model);
};

var handleError = function(res) {
	return res.status(401).send({
		message: 'Authentication has failed'
	});
};

exports.send = function(email, res) {
	var payload = {
		sub: email
	};

	var token = jwt.encode(payload, secret);

	var transporter = nodemailer.createTransport(smtpTransport(config.smtp));
	var mailOptins = {
		from: 'Accounts <onlinefakename@gmail.com>',
		to: email,
		subject: 'jsonwebtoken Account Verification',
		html: getHtml(token)
	};

	transporter.sendMail(mailOptins, function(err, info) {
		if (err) {
			console.log('error in sending email', err);
			return res.status(500, err);
		}

		console.log('email sent', info);
	});
};

exports.handler = function(req, res) {
	var token = req.query.token;
	var payload = jwt.decode(token, secret);
	var email = payload.sub;

	if (!email) {
		return handleError(res);
	}

	User.findOne({
		email: email
	}, function(err, foundUser) {
		if (err) {
			return res.status(500);
		}

		if (!foundUser) {
			return handleError(res);
		}

		if (!foundUser.active) {
			foundUser.active = true;
		}

		foundUser.save(function(err) {
			if (err) {
				return res.status(500);
			}

			return res.redirect(config.appUrl);
		});

	});
};
