var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var userid = 0;

server.listen(process.env.PORT || 5000);

app.use(express.static(__dirname + '/bower_components'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  io.emit('welcome', userid);
  userid++;
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
