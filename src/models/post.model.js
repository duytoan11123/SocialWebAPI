const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    caption: { type: String },
    likes: { type: Number, default: 0 }
    // Note: likes count can be denormalized or calculated. 
    // We'll keep a field for simple sorting, but real count might come from Like collection.
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

postSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model('Post', postSchema);
