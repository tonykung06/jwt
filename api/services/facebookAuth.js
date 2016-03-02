var request = require('request');
var qs = require('querystring');
var createSendToken = require('../helpers/createSendToken.js');
var User = require('../models/User.js');
var config = require('../configs/server.config.js');

module.exports = function(req, res) {
	var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
	var graphApiUrl = 'https://graph.facebook.com/me';
	var params = {
		client_id: req.body.clientId,
		redirect_uri: req.body.redirectUri,
		code: req.body.code,
		client_secret: config.facebookAuth.secret
	};

	request.get({
		url: accessTokenUrl,
		qs: params
	}, function(err, response, body) {
		var parsedBody = qs.parse(body);

		request.get({
			url: graphApiUrl,
			qs: parsedBody,
			json: true
		}, function(err, response, body) {
			User.findOne({
				facebookId: body.id
			}, function(err, existingUser) {
				if (existingUser) {
					return createSendToken(existingUser, res);
				}

				var newUser = new User();

				newUser.facebookId = body.id;
				newUser.displayName = body.name;
				newUser.save(function(err) {
					return createSendToken(newUser, res);
				});
			});
		});
	});
};