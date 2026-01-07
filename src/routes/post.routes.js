const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

const commentController = require('../controllers/comment.controller');
const likeController = require('../controllers/like.controller');

router.get('/', postController.getPosts);
router.post('/', postController.createPost);
router.delete('/:id', postController.deletePost);
router.put('/:id', postController.updatePost);

// Comments
router.get('/:postId/comments', commentController.getComments);
router.post('/:postId/comments', commentController.createComment);

// Likes
router.post('/:postId/like', likeController.toggleLike);

module.exports = router;
