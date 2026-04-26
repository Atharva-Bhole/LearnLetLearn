const Chat = require('../models/Chat');
const User = require('../models/User');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', ({ userId }) => {
      socket.join(userId);
    });

    socket.on('send_message', async ({ senderId, receiverId, message, fileUrl, fileName }) => {
      const chat = new Chat({ sender: senderId, receiver: receiverId, message, fileUrl, fileName });
      await chat.save();
      io.to(receiverId).emit('receive_message', {
        senderId,
        message,
        fileUrl,
        fileName,
        timestamp: chat.timestamp
      });
    });

    socket.on('fetch_history', async ({ userId, peerId }, callback) => {
      const history = await Chat.find({
        $or: [
          { sender: userId, receiver: peerId },
          { sender: peerId, receiver: userId }
        ]
      }).sort({ timestamp: 1 });
      callback(history);
    });

    socket.on('disconnect', () => {
    });
  });
};
