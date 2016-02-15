module.exports = function(req, res, err, data) {
  res.status(200).send({
    api: true,
    code: err ? 1200 : 1000,
    body: err ? null : data,
    messages: err ? err.msg : [],
    meta: null
  });

}
