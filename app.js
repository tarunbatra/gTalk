//require
var db=require('./services/db');
var cors=require('./middlewares/cors');
var logger=require('./middlewares/logger');
var errors=require('./routes/errors');
var user=require('./routes/user');
var bodyParser=require('body-parser');
var multer=require('multer');
var path=require('path');
//app
var express=require('express');
var app=express();
//create server
var http=require('http').Server(app);
app.use(express.static(__dirname + '/views'));
//db
db();
//use middlewares
app.use(cors,logger);
app.use(multer().array());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//return index.js
app.get('/',function(req, res){
    res.sendFile(path.join(__dirname, '/views', 'index.html'));
});
//return user api
app.use('/user',user);

//listen server
http.listen(3000, function(){
    console.log('listening on *:3000');
});



//fallback
app.use(errors);