const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    contributor: {
        type: Schema.Types.ObjectId,
        ref: 'Contributor'
    },
    title: {
        type: String,
        required: true,
        max: [128, "Title too long. Max: 128 characters."]
    },
    details: {
        type: String,
        required: true,
        max: [500, "Details too long. Max: 500 characters."]
    },
    county: {
        type: String,
        required: true,
        lowercase: true
    },
    lng: Number,
    lat: Number,
    stories: {
        type: String,
        max: [500, "Stories field too long. Max: 500 characters."]
    },
    previousFunctions: {
        type: String,
        max: [500, "Previous functions field too long. Max: 500 characters."]
    },
    suggestedFunctions: {
        type: String,
        max: [500, "Suggested functions field too long. Max: 500 characters."]
    },
    isRecovered: {
        type: Boolean,
        required: true
    },
    images: {
        type: [String]
    },
    createdAt: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date,
        default: Date.now
    },
    declined: { type: Boolean, default: false },
    declinedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    declinedAt: {
        type: Date,
        default: Date.now
    },
    likes: { type: Number, default: 0 },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'PostComment'
    }
});

module.exports = mongoose.model("Post", postSchema);
