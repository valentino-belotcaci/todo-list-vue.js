require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')
const User = require('../models/User')
const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth');//protect specific routes, eg: /todos

app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

// Register route
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).json({ message: 'Missing credentials' })

        // check if user already exists
        const existing = await User.findOne({ email })
        if (existing) return res.status(409).json({ error: 'Email already exists' })

        const user = new User({ email, password })
        await user.save()

        res.status(201).json({ message: `You registered successfully` })
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: 'Invalid data' })
    }
})
  
// Login route

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ message: 'Missing credentials' })

    const user = await User.findOne({ email })

    if (!user)
      return res.status(404).json({ message: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
      return res.status(401).json({ message: 'Incorrect password' })

    const token = jwt.sign(//create jwt token
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
        message: 'Login successful',
        token,
    });

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/todos', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id });
        res.json(todos);
        console.log('req.user:', req.user);
    }
    catch{
        res.status(500).json({error: 'Server error'})
    }
});

app.post('/todos', auth, async (req, res) => {
    try {
        const { title, description } = req.body
    
        if (!title || !description)
            return res.status(400).json({ message: 'Missing fields' })
        
        const todo = new Todo({ title: title, 
            description: description, 
            completed: false, 
            userId: req.user.id})

        await todo.save();
    
        res.status(200).json({
            message: 'Added todo Succefully',
            todo,
        });
  
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
});


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
