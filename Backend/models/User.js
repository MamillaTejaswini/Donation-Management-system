const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: String,
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date }, // Updated when they perform an action
  active: { type: Boolean, default: false }, // Based on whether they did at least one action
});

module.exports = mongoose.model('User', userSchema);
