const mongoose = require('mongoose');
const donationSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, required: true }, // store donor email
  phone: String,
  donationType: String,
  itemType: String,
  quantity: String,
  expiryDate: String,
  pickupLocation: String,
  itemImage: String, // if you want to save image URL or filename
  status: {
    type: String,
    enum: ["claimed", "pending", "picked", "cancelled"], // define your status options
    default: "claimed"
  },
 pickedUpBy: {
    type: String,
    default: null
  },
  pickedTime: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = mongoose.model('Donation', donationSchema);