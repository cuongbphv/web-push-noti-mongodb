const mongoose = require('mongoose');  
const Schema   = mongoose.Schema;

const userSchema = new Schema({ 
  endpoint: { type: String },
  keys: {
      p256dh: { type: String },
      auth: { type: String }
  }
});

module.exports = mongoose.model('User', userSchema, "users");