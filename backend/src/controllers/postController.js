const Post = require('../models/Post');
const User = require('../models/User');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId;
    const post = new Post({ title, content, author: userId });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
