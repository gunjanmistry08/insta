const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const PostScheme = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    picurl: {
        type: String,
        required: true
    },
    likes: [{
        type: ObjectId,
        ref: "User"
    }],
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    comments: [{
        text: String,
        postedBy: {
            type: ObjectId,
            ref: "User"
        }
    }]
})

mongoose.model("Post", PostScheme)