// dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const formatMessage = require('./utils/messages');
const {
   userJoin,
   getCurrentUser,
   userLeave,
   getRoomUsers,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// set static file
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat Bot';

// run when client connects
io.on('connection', (socket) => {
   socket.on('joinRoom', ({ username, chatKey }) => {
      const user = userJoin(socket.id, username, chatKey);

      socket.join(user.chatKey);

      // welcome current user
      socket.emit('message', formatMessage(botName, 'Welcome to Chat App!'));

      // broadcast when a user connects
      socket.broadcast
         .to(user.chatKey)
         .emit(
            'message',
            formatMessage(botName, `${user.username} has joined the chat!`)
         );

      // send users and room info
      io.to(user.chatKey).emit('roomUsers', {
        chatKey: user.chatKey,
         users: getRoomUsers(user.chatKey),
      });
   });

   // listen for chatMessage
   socket.on('chatMessage', (msg) => {
      const user = getCurrentUser(socket.id);

      io.to(user.chatKey).emit('message', formatMessage(user.username, msg));
   });

   // runs when clients disconnects
   socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if (user) {
         io.to(user.chatKey).emit(
            'message',
            formatMessage(botName, `${user.username} has left the chat!`)
         );

         // send users and room info
         io.to(user.chatKey).emit('roomUsers', {
          chatKey: user.chatKey,
            users: getRoomUsers(user.chatKey),
         });
      }
   });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});