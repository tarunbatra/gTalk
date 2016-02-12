const responder = require('./../middlewares/responder');
var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    responder(req, res, 1);
  },
  function(err, req, res, next) {
    responder(req, res, err);
  });

module.exports = router;
