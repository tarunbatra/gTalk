var _ = require('underscore');

var user = require('./../models/user');
var message = require('./../models/messages');
var responder = require('./../middlewares/responder');

//object to store sockets - format : { _id : socket }
var sockets = {};
//function to emit event of type 'type' to 'to' with data 'data'
var emitNotif = function(type, to, data) {
  try {
    sockets[to].emit(type, data);
  } catch (e) {
    console.log('User isn\'t online');
    delete sockets[to];
  }
};
module.exports = function(io) {
  io.on('connection', function(socket) {
    //user comes online
    socket.on('connection', function(data) {
      //for personal msgs
      sockets[data._id] = socket;
      //sets user as online
      user.setStatus({
        username: data.username
      }, 'online', function(error) {
        if (error) console.log(error);
      });
      //getting all users info and emitting to all
      user.getAll(function(err, userData) {
        if (err) console.log(err);
        console.log(JSON.stringify(userData));
        io.emit('notification', {
          users: userData
        });
      });
    });

    //user goes offline
    socket.on('disconnection', function(data) {
      //sets user as offline
      user.setStatus({
        username: data
      }, 'offline', function(error) {
        if (error) console.log(error);
      });
      //getting all users info and emitting to all
      user.getAll(function(err, userData) {
        if (err) console.log(err);
        console.log(JSON.stringify(userData));
        io.emit('notification', {
          users: userData
        });
      });
    });

    //user A sends request to user B
    socket.on('sendReq', function(data) {
      //send req
      user.sendReq(data, function(err) {
        if (err) console.log(err);
        //getting all users info
        user.getAll(function(err, usersData) {
          if (err) console.log(err);
          //emitting users info to user A
          emitNotif('notification', data.from, {
            users: usersData
          });
          //emitting users info to user B
          emitNotif('notification', data.to, {
            users: usersData,
            cause: data.from,
            code: 2
          });
        });
      });
    });

    //user A cancels request of user B
    socket.on('cancelReq', function(data) {
      //cancel req
      user.cancelReq(data, function(err) {
        if (err) console.log(err);
        //getting users info
        user.getAll(function(err, usersData) {
          if (err) console.log(err);
          //emitting users info to user A
          emitNotif('notification', data.from, {
            users: usersData
          });
          //emitting users info to user B
          emitNotif('notification', data.to, {
            users: usersData,
            cause: data.from,
            code: 0
          });
        });
      });
    });

    //user A accept req of user B
    socket.on('acceptReq', function(data) {
      //accept req
      user.acceptReq(data, function(err) {
        if (err) console.log(err);
        //getting users info
        user.getAll(function(err, usersData) {
          if (err) console.log(err);
          //emitting users info to user A
          emitNotif('notification', data.from, {
            users: usersData
          });
          //emitting users info to user B
          emitNotif('notification', data.to, {
            users: usersData,
            cause: data.from,
            code: 3
          });
        });
      });

    });
    //user A rejects req of user B
    socket.on('rejectReq', function(data) {
      user.rejectReq(data, function(err) {
        if (err) console.log(err);
        user.getAll(function(err, usersData) {
          if (err) console.log(err);
          //emits user info to user A
          emitNotif('notification', data.from, {
            users: usersData
          });
          //emits user info to user B
          emitNotif('notification', data.to, {
            users: usersData,
            cause: data.from,
            code: 0
          });
        });
      });
    });

    //user A sends message to user B
    socket.on('addMessage', function(msgData) {
      //add message
      message.add(msgData, function(err) {
        if (err) console.log(err);
        //get messages
        message.get(msgData.from, msgData.to, function(err, data) {
          //emit to user A
          emitNotif('newMessages', msgData.from, data);
          //emit to user B
          emitNotif('newMessages', msgData.to, data);
        });

      });
    });

    //user A wants message reload
    socket.on('getMessages', function(msgData) {
      //get messages
      message.get(msgData.from, msgData.to, function(err, data) {
        //emit to user A
        emitNotif('newMessages', msgData.from, data);
      });
    });

    //user A read msgs of user B
    socket.on('readMessages', function(data) {
      //read message
      message.read(data.from, data.to, function(err, d) {});
    });
  });
};
