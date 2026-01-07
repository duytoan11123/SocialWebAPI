const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/search', userController.searchUsers);
router.get('/:userId', userController.getProfile);
router.post('/:userId/follow', userController.toggleFollow);
router.put('/:userId', userController.updateProfile);


module.exports = router;
