var User = require('../models/User.js');
var config = require('../configs/server.config.js');
var request = require('request');
var createSendToken = require('../helpers/createSendToken.js');

module.exports = function(req, res) {
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
};