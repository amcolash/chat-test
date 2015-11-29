var socket = io();
var userid = 0;
var connected = false;

$('form').submit(function(){
  socket.emit('chat message', userid + ': ' + $('#m').val());
  $('#m').val('');
  return false;
});

$('#arrow').click(function() {
  $('#messages').toggleClass('col-xs-7');
  $('#messages').toggleClass('col-sm-9');
  $('#users').toggle();
  $('#arrow').toggleClass('glyphicon-chevron-right');
  $('#arrow').toggleClass('glyphicon-chevron-left');
});

socket.on('welcome', function(msg){
  if (!connected) {
    userid = msg;
    $('#user').text(userid + ' (You)');
    connected = true;
    $('#messages ul').append($('<li>').text('System: Welcome to the chatroom ' + userid));
  } else {
    $('#messages ul').append($('<li>').text('System: ' + msg + ' has entered the chat room'));
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
    $('#user-list').append($('<li><span class="glyphicon glyphicon-user" aria-hidden="true"></span>'
      + '<span class="user-name">' + value + '</span></li>'));
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
