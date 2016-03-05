/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcrypt-nodejs');
var createSendToken = require('../services/createSendToken');

module.exports = {
	login: function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      return res.status(401).send({
        message: 'username and/or password required.'
      });
    }

    User.findOneByEmail(email, function(err, foundUser) {
      if (err || !foundUser) {
        return res.status(401).send({
          message: 'username or password invalid'
        });
      }

      //bcrypt
      bcrypt.compare(password, foundUser.password, function(err, isMatch) {
        if (err) {
          return res.status(403);
        }

        if (!isMatch) {
          return res.status(401).send({
            message: 'username or password invalid!!!'
          });
        }

        createSendToken(foundUser, res);
      });
    });
  },
  register: function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      return res.status(401).send({
        message: 'username and/or password required.'
      });
    }

    User.findOneByEmail(email, function(err, user) {
      if (err) {
        return done(err);
      }

      if (user) {
        return res.status(401).send({
          message: 'user already registered'
        });
      }

      var newUser = User.create({
        email: email,
        password: password
      }).exec(function(err, newUser) {
        if (err) {
          return res.status(403);
        }

        createSendToken(newUser, res);
      });
    });
  }
};

