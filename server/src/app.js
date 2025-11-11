require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')
const User = require('../models/User')
const Todo = require('../models/TodoList');
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

app.get('/todos/:id', auth, async (req, res) => {
    try {
        const list = await Todo.findById(req.params.id);
        
        if (!list) 
            return res.status(404).json({ message: 'Todo not found' });
    
        console.log(list)
        res.status(200).json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a new sub-todo to a list
app.post('/todos/:id', auth, async (req, res) => {
    try {

        const { title, description, priority } = req.body;

        if (!title) 
        return res.status(400).json({ message: 'Missing title' });

        const list = await Todo.findById(req.params.id);

        if (!list) 
        return res.status(404).json({ message: 'Todo list not found' });

        const newTodo = {
        title,
        description,
        completed: false,
        date: new Date().toLocaleString('en-GB', { timeZone: 'Europe/Rome' }),
        priority: priority || 1,
        };

        list.todos.push(newTodo);
        await list.save();

        res.status(201).json({ message: 'Task added', todo: newTodo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
  
  
// Update an existing sub-todo
app.put('/todos/:id/:taskId', auth, async (req, res) => {
    try {
        const { id, taskId } = req.params;
        const updates = req.body;

        const list = await Todo.findById(id);
        if (!list) return res.status(404).json({ message: 'Todo list not found' });

        const todo = list.todos.id(taskId);
        if (!todo) return res.status(404).json({ message: 'Task not found' });

        Object.assign(todo, updates);
        await list.save();

        res.status(200).json({ message: 'Task updated', todo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
  
  
// Delete a sub-todo
app.delete('/todos/:id/:taskId', auth, async (req, res) => {
    try {
        const { id, taskId } = req.params;

        const list = await Todo.findById(id);
        if (!list) return res.status(404).json({ message: 'Todo list not found' });

        const todo = list.todos.id(taskId);
        if (!todo) return res.status(404).json({ message: 'Task not found' });

        list.todos.pull(taskId);
        await list.save();

        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
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
