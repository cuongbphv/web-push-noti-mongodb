const mongoose = require('mongoose');  
const Schema   = mongoose.Schema;

const taskSchema = new Schema({ 
  task: { type: String },
  status: { type: String },
  priority: { type: String }
});

module.exports = mongoose.model('Task', taskSchema, "tasks");