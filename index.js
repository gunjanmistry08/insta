const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { MONGOURI } = require('./config/key')

// mongoose 
mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false })
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected')
})
mongoose.connection.on('error', (err) => {
    console.log('Mongoose error', err)
})

// models
require('./models/user')
require('./models/post')


// routes
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (res,req) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})