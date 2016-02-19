module.exports = function(req, res, err, data) {

  var ERROR_STATUS=1200;
  var SUCCESS_STATUS=1000;

  res.status(200).send({
    api: true,
    code: err ? ERROR_STATUS : SUCCESS_STATUS,
    body: err ? null : data,
    messages: err ? err.msg : [],
    meta: null
  });
}
