var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var model = mongoose.model('messages', new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  msg: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  read: {
    type: Boolean
  }
}));

model.add = function(msgData, cb) {
  var msg = new this(msgData);
  msg.save(function(err) {
    cb(err);
  });
};
model.get = function(sender, receiver, cb) {
  model.find({
    $or: [{
      from: sender,
      to: receiver
    }, {
      from: receiver,
      to: sender
    }]
  }, function(err, data) {
    cb(err, data);
  });
};

model.read = function(sender, receiver, cb) {
  model.update({
    from: sender,
    to: receiver
  }, {
    $set: {
      read: true
    }
  }, {
    multi: true
  }, function(err) {
    cb(err);
  });
};

module.exports = model;
