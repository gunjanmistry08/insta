const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')

const User = mongoose.model('User')

const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require("../config/key")

const loginmiddleware = require("../middleware/loginmiddleware")

router.get('/protected', loginmiddleware, (req, res) => {
    res.send("Hello User")
})

router.get('/', (req, res) => {
    res.send('Hello')
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email }).then((saveduser) => {
        if (saveduser) {
            return res.status(422).json({ error: "User all ready exits with that email" })
        }
        const user = new User({
            email,
            password,
            name
        })

        user.save().then(user => {
            res.json({ message: "Succesfull" })
        }).catch(error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
    })
})

router.post('/login', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email }).then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid Email or Password" })

        }
        if (password === savedUser.password) {
            // res.json({message:"Succesfully signed in"})
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email, followers, following, pic } = savedUser
            res.json({ token, user: { _id, name, email, followers, following, pic } })
        } else {
            return res.status(422).json({ error: "Invalid Email or Password" })
        }
    }).catch(error => console.log(error))

})

module.exports = router