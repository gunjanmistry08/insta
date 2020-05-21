const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const loginmiddleware = require('../middleware/loginmiddleware')
const Post = mongoose.model("Post")


// posts
router.get('/allpost', loginmiddleware, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy","_id name")
        .sort('-createdAt')
        .then(posts => res.json({ posts }))
        .catch(error => console.log(error))
})

router.get('/followingpost', loginmiddleware, (req, res) => {
    Post.find({postedBy:{$in : req.user.following}})
        .populate("postedBy", "_id name")
        .populate("comments.postedBy","_id name")
        .sort('-createdAt')
        .then(posts => res.json({ posts }))
        .catch(error => console.log(error))
})

router.get('/mypost', loginmiddleware, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .sort('-createdAt')
        .then(posts => res.json({ posts }))
        .catch(error => console.log(error))
})

router.post('/createpost', loginmiddleware, (req, res) => {
    const { title, body, picurl } = req.body
    if (!title || !body || !picurl) {
        return res.status(422).json({ error: "Please add all the fields" })
    }

    const post = new Post({
        title,
        body,
        picurl,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch(error => {
            console.log(error)
        })
})

router.delete('/deletepost/:postId', loginmiddleware, (req,res) => {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id" )
    .exec((error,post) => {
        if (error || !post) {
            return res.status(422).json({error})
        }

        if (post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result=> res.json({message:"Post deleted successfully"}))
            .catch(error => res.json({error}))
        } 
        
    })
})

// Likes
router.put('/like', loginmiddleware, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((error,result) => {
        if (error) {
            res.status(422).json({error})
        } else {
            res.json(result)
        }
    })
})

router.put('/unlike', loginmiddleware, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((error,result) => {
        if (error) {
            res.status(422).json({error})
        } else {
            res.json(result)
        }
    })
})

// Comments
router.put('/comment', loginmiddleware, (req, res) => {
    const comment={
        text: req.body.text,
        postedBy: req.user._id
    }
        Post.findByIdAndUpdate(req.body.postId, {
            $push: { comments: comment }
        },{
            new:true
        })
        .populate("postedBy","_id name")
        .populate("comments.postedBy","_id name")
        .exec((error,result) => {
            if (error) {
                res.status(422).json({error})
            } else {
                res.json(result)
            }
        })
    })

router.put('/deletecomment/:postId/:commentId', loginmiddleware, (req,res) => {
    Post.findByIdAndUpdate(req.params.postId, {
        $pull: {comments :{_id:req.params.commentId}}
    },{
        new:true
    })
    .populate('postedBy','_id name')
    .populate('comments.postedBy','_id name')
    .exec((error,comment) => {
        if (error || !comment) {
            return res.status(422).json({error})
        }
        res.json(comment);
        

        
    })
    
})



module.exports = router