var jwt = require('jsonwebtoken');
var responder = require('./responder');
var config = require('./../config');
module.exports = function(req, res, next) {
  var t = req.body.token || req.query.token || req.headers['x-access-token'];
  if (t) {
    jwt.verify(t, config.secret, function(err, decoded) {
      responder(req, res, 0, err ? {
        authenticated: false
      } : {
        authenticated: true
      });
    });
  }
};
