module.exports = function(req, res, err, data) {
  console.log(err);
  console.log(JSON.stringify(data));
  res.status(200).send({
    api: true,
    code: err ? 1200 : 1000,
    body: err ? null : data,
    messages: err ? ['The resource you are looking for does not exist.'] : [],
    meta: null
  });

}
