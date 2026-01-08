const Like = require('../models/like.model');

exports.toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'UserId is required' });
        }

        const existingLike = await Like.findOne({ postId, userId });

        if (existingLike) {
            // Unlike
            await Like.deleteMany({ postId, userId });
            res.status(200).json({ liked: false });
        } else {
            // Like
            await Like.create({ postId, userId });
            res.status(200).json({ liked: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.checkLikeStatus = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'UserId is required' });
        }

        const existingLike = await Like.findOne({ postId, userId });

        res.status(200).json({ liked: !!existingLike });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
