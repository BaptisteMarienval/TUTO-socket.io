var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// Variables globales
// Ces variables resteront durant toute la vie du seveur et sont communes pour chaque client (node server.js)
// Liste des messages de la forme { pseudo : 'Mon pseudo', message : 'Mon message' }
var messages = [];
var users = [];


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/socket.html');
});

io.on('connection', function(socket){

  socket.emit('updateUsersList', users);

   socket.on('disconnect', function(){
     console.log('disconnect');
     var index = users.indexOf(socket.pseudo);
     users.splice(index, 1);
     io.emit('delUser', socket.pseudo);
     io.emit('updateUsersList', users);
   });

   socket.on('newUser', function(pseudo){;
    socket.pseudo = pseudo;
    users.push(pseudo);
    io.emit('newUser', pseudo);
    io.emit('updateUsersList', users);
   });

   socket.on('nouveauMessage', function(msg){
      console.log('message: ' + msg);
      socket.broadcast.emit('recupererNouveauMessage', msg);
   });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
