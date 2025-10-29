require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')
const User = require('../models/User')

app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

app.post('/register', async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password
        })

        await user.save()

        res.send({
            message: `User ${user.email} registered successfully`
        })
    }catch (err) {
        console.log(err)
        res.status(400).send({error: 'Email already exists or invalid data'})
    }
})//get request to a status inpoint

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => 
    console.log('Connected to MongoDB')
  ).catch(err => 
        console.error('MongoDB connection error:', err)
    )

// sample route
app.get('/status', (req, res) => res.send({ message: 'API + MongoDB running' }))

// start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
