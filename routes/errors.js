var express = require('express');
var responder = require('./../middlewares/responder');

var router = express.Router();

router.use(function(req, res, next) {
    responder(req, res, 1);
  },
  function(err, req, res, next) {
    responder(req, res, err);
  });

module.exports = router;
