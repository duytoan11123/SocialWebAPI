const Comment = require('../models/comment.model');
const CommentLike = require('../models/comment_like.model');

exports.getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.query; // Current user to check if liked

        const comments = await Comment.find({ postId }).sort({ createdAt: 1 }).populate('userId', 'userName avatarUrl id');

        const commentsWithDetails = await Promise.all(comments.map(async (c) => {
            const cJson = c.toJSON();
            const likesCount = await CommentLike.countDocuments({ commentId: c._id });
            let isLiked = false;
            if (userId) {
                const like = await CommentLike.findOne({ commentId: c._id, userId });
                isLiked = !!like;
            }

            return {
                ...cJson,
                user: cJson.userId, // populated
                likesCount,
                isLiked
            };
        }));

        res.status(200).json(commentsWithDetails);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, content, parentId } = req.body;

        if (!userId || !content) {
            return res.status(400).json({ message: 'UserId and Content are required' });
        }

        let comment = await Comment.create({ postId, userId, content, parentId });
        comment = await Comment.findById(comment._id).populate('userId', 'userName avatarUrl id');

        const cJson = comment.toJSON();
        const response = {
            ...cJson,
            user: cJson.userId,
            likesCount: 0,
            isLiked: false
        };

        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'UserId is required' });
        }

        const existingLike = await CommentLike.findOne({ commentId, userId });

        if (existingLike) {
            // Unlike
            await CommentLike.deleteMany({ commentId, userId });
            res.status(200).json({ liked: false });
        } else {
            // Like
            await CommentLike.create({ commentId, userId });
            res.status(200).json({ liked: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
