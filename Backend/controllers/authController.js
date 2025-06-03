const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.signup = async (req, res) => {
  const { role, fullName, email, password } = req.body;

  if (!email || !password || !role || !fullName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ role, fullName, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== role) {
      return res.status(403).json({
        message: `Access denied: You are registered as ${user.role}`,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      SECRET,
      { expiresIn: '1d' }
    );
console.log("Sending login response with email:", user.email);
    // Include email in response
    // res.json({ token, email: user.email, message: "Login successful" });
    res.json({ 
  success: true,
  message: "Login successful", 
  token, 
  email: user.email,// <-- add this line
  fullName: user.fullName,
   role: user.role,
});


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
