const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String } // formatted date string
});

todoSchema.pre('save', function (next) {
    const now = new Date();
    this.date = now.toLocaleString('en-GB', { timeZone: 'Europe/Rome' });
    next();
});

module.exports = mongoose.model('Todo', todoSchema)