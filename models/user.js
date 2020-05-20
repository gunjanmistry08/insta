const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const UserScheme = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }],
    pic:{
        type:String,
        default:"https://res.cloudinary.com/gunjan008/image/upload/v1589959394/default_ivdwgl.jpg"
    }
})

mongoose.model('User',UserScheme)