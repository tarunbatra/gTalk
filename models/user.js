var mongoose = require('mongoose');
var _ = require('underscore');
var Schema = mongoose.Schema;

//contants
var REQUEST_ACCEPTED = 3;
var REQUEST_RECEIVED = 2;
var REQUEST_SENT = 1;

var model = mongoose.model('users', new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: 'String',
    enum: ['online', 'offline']
  },
  peers: [{
    peerid: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    status: {
      type: Number,
      required: true
    }
  }]
}));

model.getAll = function(cb) {
  model.find({}, {
    __v: false,
    password: false
  }, function(err, data) {
    cb(err, data);
  });
};

model.getOneByUsername = function(uname, cb) {
  model.findOne({
    username: uname
  }, {
    __v: false,
    password: false
  }, function(err, data) {
    cb(err, data);
  });
};

model.getOneById = function(id, cb) {
  model.findOne({
    _id: id
  }, {
    __v: false,
    password: false
  }, function(err, data) {
    cb(err, data);
  });
}

model.signUp = function(data, cb) {
  var u = new this(data);
  u.save(function(err) {
    cb(err);
  });
};

model.sendReq = function(data, cb) {
  model.findOneAndUpdate({
    _id: data.from
  }, {
    $addToSet: {
      peers: {
        peerid: data.to,
        status: REQUEST_SENT
      }
    }
  }, function(error, userData) {
    if (!error) {
      model.findOneAndUpdate({
        _id: data.to
      }, {
        $addToSet: {
          peers: {
            peerid: data.from,
            status: REQUEST_RECEIVED
          }
        }
      }, function(error, userData) {
        if (error) console.log(error);
      });
    }
    cb(error, userData);
  });
};

model.cancelReq = function(data, cb) {
  model.findOneAndUpdate({
    _id: data.from
  }, {
    $pull: {
      peers: {
        peerid: data.to
      }
    }
  }, function(error) {
    if (!error) {
      model.findOneAndUpdate({
        _id: data.to
      }, {
        $pull: {
          peers: {
            peerid: data.from
          }
        }
      }, function(rr) {
        if (rr) console.log(rr);
      });
    }
    cb(error);
  });

};

model.acceptReq = function(data, cb) {
  model.findOneAndUpdate({
    '_id': data.from,
    'peers.peerid': data.to
  }, {
    $set: {
      'peers.$.status': REQUEST_ACCEPTED
    }
  }, function(err, userData) {
    if (!err) {
      model.findOneAndUpdate({
        '_id': data.to,
        'peers.peerid': data.from
      }, {
        $set: {
          'peers.$.status': REQUEST_ACCEPTED
        }
      }, function(err) {
        if (err) console.log(err);
      });
    }
    cb(err);
  });
};

model.rejectReq = function(data, cb) {
  model.findOneAndUpdate({
    _id: data.from
  }, {
    $pull: {
      peers: {
        peerid: data.to
      }
    }
  }, function(error) {
    if (!error) {
      model.findOneAndUpdate({
        _id: data.to
      }, {
        $pull: {
          peers: {
            peerid: data.from
          }
        }
      }, function(error) {
        if (error) console.log(error);
      });
    }
    cb(error);
  });
};

model.setStatus = function(obj, onlineStatus, cb) {
  model.findOneAndUpdate(obj, {
    $set: {
      status: onlineStatus
    }
  }, function(error, data) {
    cb(error);
  });
}

module.exports = model;
