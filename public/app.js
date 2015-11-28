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
    userid = msg;
    $('#user').text(userid + ' (You)');
    connected = true;
    $('#messages ul').append($('<li>').text('Welcome to the chatroom ' + userid));
  } else {
    $('#messages ul').append($('<li>').text(msg + ' has entered the chat room'));
  }
});

socket.on('chat message', function(msg){
  $('#messages ul').append($('<li>').text(msg));
});

socket.on('users', function(msg) {
  console.log(msg);

  var userIndex = msg.indexOf(userid);
  if (userIndex > -1) {
    msg.splice(userIndex, 1);
  }

  $('#user-list').empty();
  $.each(msg, function(index, value) {
    $('#user-list').append($('<li>').text(value));
  });
});

$('#rename').click(function() {
  var temp = window.prompt("New User Id?", userid);
  if (temp !== null && temp !== userid) {
    socket.emit('rename', temp);
    userid = temp;
    $('#user').text(userid + ' (You)');
  }
});
