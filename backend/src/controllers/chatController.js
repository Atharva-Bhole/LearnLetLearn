const Chat = require('../models/Chat');

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const peerId = req.params.peerId;
    
    const history = await Chat.find({
      $or: [
        { sender: userId, receiver: peerId },
        { sender: peerId, receiver: userId }
      ]
    }).sort({ timestamp: 1 });
    
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
