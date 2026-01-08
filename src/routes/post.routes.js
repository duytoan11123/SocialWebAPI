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
// Comments
router.get('/:postId/comments', commentController.getComments);
router.post('/:postId/comments', commentController.createComment);
router.post('/comments/:commentId/like', commentController.toggleLike);

// Likes
router.get('/:postId/like', likeController.checkLikeStatus);
router.post('/:postId/like', likeController.toggleLike);

module.exports = router;
