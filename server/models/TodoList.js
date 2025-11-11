const mongoose = require('mongoose');

// define the small todo subschema
const subTodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  date: { type: String },
  priority: { type: Number, default: 1 }
});

const todoListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String },
  todos: [subTodoSchema]   //array of subschemas
});

todoListSchema.pre('save', function (next) {
  const now = new Date();
  this.date = now.toLocaleString('en-GB', { timeZone: 'Europe/Rome' });
  next();
});

module.exports = mongoose.model('TodoList', todoListSchema);
