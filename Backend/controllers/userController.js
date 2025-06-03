const User = require('../models/User');

// Get all users (Admin Dashboard)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user phone and location
exports.updateUserProfile = async (req, res) => {
  const { email, phone, location } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { phone, location },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
