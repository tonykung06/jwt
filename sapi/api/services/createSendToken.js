var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'haha...';

module.exports = function createSendToken(user, res) {
  var payload = {
    // iss: req.hostname,
    sub: user.id,
    exp: moment().add(10, 'days').unix()
  };

  var token = jwt.encode(payload, secret);

  res.status(200).json({
    user: user,
    token: token
  });
};
