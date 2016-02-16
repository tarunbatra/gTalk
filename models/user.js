var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var messages = require('./messages');
var model = mongoose.model('users', new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  password: {
    type: String,
    required: true
  },
  online: {
    type: Boolean
  },
  peers:

    [{
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
  this.find({}, {
    __v: false,
    password: false
  }, function(err, data) {
    cb(err, data);
  });
};

model.getOneByUsername = function(uname, cb) {
  this.findOne({
    username: uname
  }, {
    __v: false,
    password: false
  }, function(err, data) {
    cb(err, data);
  });
};

model.getOneById = function(id, cb) {
  this.findOne({
    _id: id
  }, {
    __v: false,
    password: false
  }, function(err, data) {
    cb(err, data);
  });
}

model.signIn = function(data, cb) {
  this.findOne({
    username: data.username
  }, {
    __v: false
  }, function(err, data) {
    cb(err, data);
  });
};
model.signUp = function(data, cb) {
  var u = new this(data);
  u.save(function(err) {
    cb(err);
  });
};

model.sendReq = function(data, cb) {
  console.log(JSON.stringify(data));
  model.findOneAndUpdate({
    _id: data.from
  }, {
    $addToSet: {
      peers: {
        peerid: data.to,
        status: 1
      }
    }
  }, {
    upsert: false
  }, function(error, userData) {
    if (!error) {
      model.findOneAndUpdate({
        _id: data.to
      }, {
        $addToSet: {
          peers: {
            peerid: data.from,
            status: 2
          }
        }
      }, {
        upsert: false
      }, function(error, userData) {
        cb(error);
      });
    }
    cb(error);
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
        if (!error) {
          cb(error);
        }
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
      'peers.$.status': 3
    }
  }, function(err, userData) {
    if (!err) {
      model.findOneAndUpdate({
        '_id': data.to,
        'peers.peerid': data.from
      }, {
        $set: {
          'peers.$.status': 3
        }
      }, function(err) {
        cb(err);
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
        cb(error);
      });
    }
    cb(error);
  });
};

model.setOnline = function(obj, onlineStatus, cb)

{
  model.findOneAndUpdate(obj, {
    $set: {
      online: onlineStatus
    }
  }, {
    upsert: false
  }, function(error, data) {
    console.log(JSON.stringify(data));
    cb(error);
  });
}

module.exports = model;
