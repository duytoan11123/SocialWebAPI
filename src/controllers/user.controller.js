
const User = require('../models/user.model');
const Follow = require('../models/follow.model');

exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { requesterId } = req.query; // Add requesterId query param

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userJson = user.toJSON();
        const { password, ...userProfile } = userJson;

        const followersCount = await Follow.countDocuments({ followingId: userId });
        const followingCount = await Follow.countDocuments({ followerId: userId });

        // Check if requester is following this user
        let isFollowing = false;
        if (requesterId) {
            const follow = await Follow.findOne({ followerId: requesterId, followingId: userId });
            isFollowing = !!follow;
        }

        res.status(200).json({
            ...userProfile,
            followersCount,
            followingCount,
            isFollowing
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.toggleFollow = async (req, res) => {
    try {
        const { userId } = req.params; // User being followed (You)
        const { followerId } = req.body; // Current user (Me)

        if (!followerId) {
            return res.status(400).json({ message: 'FollowerId is required' });
        }

        if (userId === followerId) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }

        const existingFollow = await Follow.findOne({ followerId, followingId: userId });

        if (existingFollow) {
            // Unfollow
            await Follow.deleteOne({ _id: existingFollow._id });
            res.status(200).json({ following: false });
        } else {
            // Follow
            await Follow.create({ followerId, followingId: userId });
            res.status(200).json({ following: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, bio, avatarUrl } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (fullName) user.fullName = fullName;
        if (bio) user.bio = bio;
        if (avatarUrl) user.avatarUrl = avatarUrl;

        await user.save();

        // Return updated user
        const userJson = user.toJSON();
        const { password, ...userProfile } = userJson;

        // Also get counts
        const followersCount = await Follow.countDocuments({ followingId: userId });
        const followingCount = await Follow.countDocuments({ followerId: userId });

        res.status(200).json({
            ...userProfile,
            followersCount,
            followingCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(200).json([]);
        }

        const users = await User.find({
            $or: [
                { userName: { $regex: q, $options: 'i' } },
                { fullName: { $regex: q, $options: 'i' } }
            ]
        }).limit(20);

        // Return simplified user objects
        const results = users.map(user => {
            const u = user.toJSON();
            return {
                id: u.id,
                userName: u.userName,
                fullName: u.fullName,
                avatarUrl: u.avatarUrl
            };
        });

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
