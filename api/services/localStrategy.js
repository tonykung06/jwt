var User = require('../models/User.js');
var LocalStrategy = require('passport-local').Strategy;

var strategyOpts = {
	usernameField: 'email'
};

exports.login = new LocalStrategy(strategyOpts, function(email, password, done) {
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

exports.register = new LocalStrategy(strategyOpts, function(email, password, done) {
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