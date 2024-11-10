// controllers/authController.js

const User = require("../models/User");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = password === user.password;
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    res.json({ id: user._id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
