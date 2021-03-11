const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postCommentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        max: [240, "Details too long. Max: 240 characters."]
    },
    createdAt: { type: Date, default: Date.now },
    approved: { type: Boolean, default: true },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
});

module.exports = mongoose.model("PostComment", postCommentSchema);
