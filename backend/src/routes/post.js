const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../utils/authMiddleware');

// Get all posts
router.get('/', postController.getAllPosts);

// Create a new post (auth required)
router.post('/', authMiddleware, postController.createPost);

module.exports = router;
