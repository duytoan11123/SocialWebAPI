const express = require('express');
const cors = require('cors');
const config = require('./config');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/uploads', express.static('uploads'));



app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Flutter Demo Web API' });
});

// Start Server
app.listen(config.port, '0.0.0.0', () => {
    console.log(`Server running on port ${config.port} in ${config.env} mode`);
});

