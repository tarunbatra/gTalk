var jwt = require('jsonwebtoken');
var responder = require('./responder');
var config = require('./../config');
var jwtGenerator = function(req, res, next) {
  req.body.data.token = jwt.sign(req.body.data, config.secret, {
    expiresIn: 86400
  });
  responder(req, res, 0, req.body.data);
};
module.exports = jwtGenerator;
