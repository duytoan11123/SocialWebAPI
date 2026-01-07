const User = require('../models/user.model');

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ userName: username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const user = await User.create({ userName: username, password, email });

        // Return user without password
        const userJson = user.toJSON();
        const { password: _, ...userWithoutPassword } = userJson;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ userName: username });
        // Note: In real app compare hashed password
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const userJson = user.toJSON();
        const { password: _, ...userWithoutPassword } = userJson;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
