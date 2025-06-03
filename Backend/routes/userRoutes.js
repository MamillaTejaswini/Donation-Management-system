const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserByEmail,
  updateUserProfile
} = require('../controllers/userController');

// Get all users (for admin dashboard)
router.get('/', getAllUsers);

// Get user by email (should come AFTER `/`)
router.get('/email/:email', getUserByEmail);

// Update user profile (phone, location)
router.post('/update', updateUserProfile);

module.exports = router;
