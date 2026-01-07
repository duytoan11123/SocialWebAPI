const Post = require('../models/post.model');
const User = require('../models/user.model');
const Like = require('../models/like.model');

exports.getPosts = async (req, res) => {
    try {
        const { authorId } = req.query;
        const filter = authorId ? { authorId } : {};

        const posts = await Post.find(filter).sort({ createdAt: -1 }).populate('authorId', 'userName avatarUrl id');

        // In Mongoose, we can populate virtuals or manual joins.
        // The previous implementation added `likes` count and `author` object.

        const postsWithDetails = await Promise.all(posts.map(async (post) => {
            const p = post.toJSON();
            const likeCount = await Like.countDocuments({ postId: post._id });
            console.log(`[DEBUG] Post ${post._id} likes: ${likeCount}`);

            return {
                ...p,
                author: p.authorId, // populated
                likes: likeCount
            };
        }));

        res.status(200).json(postsWithDetails);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { authorId, imageUrl, caption } = req.body;

        if (!authorId || !imageUrl) {
            return res.status(400).json({ message: 'AuthorId and ImageUrl are required' });
        }

        // Validate author exists
        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({ message: 'Author not found' });
        }

        let post = await Post.create({ authorId, imageUrl, caption });

        // Populate author details for the response
        // We can manually construct it or fetch again
        // Fetching again is safer for consistent format
        post = await Post.findById(post._id).populate('authorId', 'userName avatarUrl id');

        const p = post.toJSON();

        // Return structured like getPosts expects
        const responsePost = {
            ...p,
            author: p.authorId,
            likes: 0
        };

        res.status(201).json(responsePost);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { caption } = req.body;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // We can add auth check here if needed (req.user.id === post.author.toString())

        if (caption !== undefined) post.caption = caption;

        await post.save();

        // Populate author to return full object if needed, or just return success
        // Returning full updated post is better for frontend state update
        await post.populate('authorId', 'userName avatarUrl id');

        const likeCount = await Like.countDocuments({ postId: post._id });
        const p = post.toJSON();

        const responsePost = {
            ...p,
            author: p.authorId,
            likes: likeCount
        };

        res.status(200).json(responsePost);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
