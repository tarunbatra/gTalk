var bcrypt = require('bcrypt');
var responder = require('./responder');
module.exports = function(req, res, next) {
  console.log('hasher');
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      responder(req, res, err);
    } else {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        if (err) {
          responder(req, res, err);
        } else {
          req.body.password = hash;
          next();
        }
      });
    }
  });
};
