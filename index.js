var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var HashMap = require('hashmap');

var nextuserid = 0;
var allClients = new HashMap();

server.listen(process.env.PORT || 5000);

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
  io.emit('welcome', 'user' + nextuserid);
  allClients.set(socket, 'user' + nextuserid);
  io.emit('users', allClients.values());

  nextuserid++;

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  socket.on('rename', function(msg) {
    io.emit('chat message', allClients.get(socket) + ' has changed their name to ' + msg);
    allClients.set(socket, msg);
    io.emit('users', allClients.values());
  });

  socket.on('disconnect', function() {
    io.emit('chat message', allClients.get(socket) + ' left chat room');
    allClients.remove(socket);
    io.emit('users', allClients.values());
  });
});
