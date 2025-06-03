// utils/activityTracker.js
const User = require('../models/User');

exports.markUserActive = async (email) => {
  if (!email) return;

  try {
    await User.findOneAndUpdate(
      { email },
      {
        active: true,
        lastActive: new Date()
      },
      { new: true }
    );
  } catch (err) {
    console.error(`Failed to mark user ${email} as active:`, err);
  }
};
