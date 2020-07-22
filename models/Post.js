const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    comment: [{
        type: String,
        ref: "Comment"
    }]
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;