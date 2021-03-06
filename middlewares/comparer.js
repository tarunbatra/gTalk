var bcrypt = require('bcrypt');
var responder = require('./responder');

module.exports = function(req, res, next) {
  bcrypt.compare(req.body.password, req.body.hash, function(err,result) {
      if (err || !result) {
      err={msg:'Invalid username or password'};
      responder(req, res, err);
    } else {
      console.log('Success');
      next();
    }
  });
};
