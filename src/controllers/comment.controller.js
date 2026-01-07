const Comment = require('../models/comment.model');

exports.getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ postId }).sort({ createdAt: 1 }).populate('userId', 'userName avatarUrl id');

        const commentsWithUser = comments.map(c => {
            const cJson = c.toJSON();
            return {
                ...cJson,
                user: cJson.userId // populated
            };
        });

        res.status(200).json(commentsWithUser);
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

        const comment = await Comment.create({ postId, userId, content, parentId });
        // Populate user for consistency in return if needed, but simple return is ok.
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
