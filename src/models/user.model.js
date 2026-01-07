const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Mongoose automatically adds _id (ObjectId). 
    // If we want numeric IDs like SQL, we'd need a counter plugin. 
    // But for MongoDB best practice, we stick to ObjectId or String.
    // Note: Previous mock endpoints returned 'id'. We should map _id to id or update API clients.
    // For simplicity, we'll expose virtual 'id'.
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    fullName: { type: String },
    bio: { type: String },
    avatarUrl: { type: String }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for ID
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model('User', userSchema);
