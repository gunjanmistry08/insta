const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const loginmiddleware = require('../middleware/loginmiddleware')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/user/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
        .select('-password')
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedby", "_id name")
                .exec((error, posts) => {
                    if (error) {
                        return res.status(422).json({ error })
                    }
                    return res.json({ user, posts })
                })
        })
})

router.put('/follow', loginmiddleware, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }

    }, {
        new: true
    }, ((error, result) => {
        if (error) {
            return res.status(422).json({ error })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, {
            new: true
        }).select('-password').then(result => res.json(result))
            .catch(error => res.json({ error }))
    }))
})

router.delete('/deleteuser/:id', loginmiddleware, (req, res) => {
    User.findById(req.params.id)
        .exec((error, user) => {
            if (error) return res.status(422).json({ error });
            Post.deleteMany({ postedBy: { _id: req.params.id } })
                .then(result => {
                    return res.json(result)
                })
                .catch(error => {
                    return res.status(422).json(error)
                })
                user.remove()
        })
})

router.put('/unfollow', loginmiddleware, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }

    }, {
        new: true
    }, ((error, result) => {
        if (error) {
            return res.status(422).json({ error })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, {
            new: true
        }).select('-passoword').then(result => res.json(result))
            .catch(error => res.json({ error }))
    }))
})

router.put('/updatepic', loginmiddleware, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: "pic canot post" })
            }
            res.json(result)
        })
})

module.exports = router