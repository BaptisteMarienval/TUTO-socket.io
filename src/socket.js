var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// Variables globales
// Ces variables resteront durant toute la vie du seveur et sont communes pour chaque client (node server.js)
// Liste des messages de la forme { pseudo : 'Mon pseudo', message : 'Mon message' }
var messages = [];


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/socket.html');
});

io.on('connection', function(socket){
   console.log('a user connected');
   socket.emit('recupererMessages', messages);

   socket.on('disconnect', function(){
      socket.broadcast.emit('disconnect');
   });

   socket.on('newUser', function(pseudo){
    io.emit('newUser', pseudo);
   });

   socket.on('nouveauMessage', function(msg){
      console.log('message: ' + msg);
      messages.push(msg);
      socket.broadcast.emit('recupererNouveauMessage', msg);
   });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});

