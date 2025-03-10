const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Admin schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Hash the password before saving
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Salt rounds set to 10
  }
  next();
});

// Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
