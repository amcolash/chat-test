var socket = io();
var userid = 0;
var connected = false;

$('form').submit(function(){
  socket.emit('chat message', userid + ': ' + $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('welcome', function(msg){
  if (!connected) {
    userid = 'user' + msg;
    $('#user').text(userid + ' (You)');
    connected = true;
    $('#messages ul').append($('<li>').text('Welcome to the chatroom ' + userid));
  } else {
    $('#messages ul').append($('<li>').text('user' + msg + ' has entered the chat room'));
  }
});
socket.on('chat message', function(msg){
  $('#messages ul').append($('<li>').text(msg));
});

$('#rename').click(function() {
  var temp = window.prompt("New User Id?", userid);
  if (temp !== null && temp !== userid) {
    socket.emit('chat message', userid + ' has changed their name to ' + temp);
    userid = temp;
    $('#user').text(userid + ' (You)');
  }
});
