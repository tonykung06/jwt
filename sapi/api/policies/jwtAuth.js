var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({
      message: 'You are not authorized.'
    });
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, 'haha...'); //hard code secret :)

  if (!payload || !payload.sub) {
    return res.status(401).send({
      message: 'Authentication failed'
    });
  }

  next();
};
