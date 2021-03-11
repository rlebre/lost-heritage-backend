const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: {
        type: String,
        required: 'URL is required',
    },
    name: {
        type: String,
        required: 'Name is required',
    },
    key: {
        type: String,
        required: 'Key is required',
    },
    size: {
        type: Number,
        required: 'Size is required',
    },
    postUid: {
        type: String,
        required: 'PostUID is required',
    },
    isPostCreated: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model("Image", imageSchema);