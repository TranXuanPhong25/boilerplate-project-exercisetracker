const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
   username: {
      type: String,
      unique: true
   },
   exercises : [{
      description: String,
      duration: Number,
      date: Date
   }],
   log: [{
      description: String,
      duration: Number,
      date: Date
   }]
})

const User = mongoose.model('User', UserSchema);

module.exports = { User }