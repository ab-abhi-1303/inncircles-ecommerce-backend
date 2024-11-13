const User = require("../models/User");

exports.assignRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Admin" } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.addUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = await User.find({ username: username });
    if (users.length) return res.status(403).json({ msg: "User already exists" });
    const user = new User({ username, password, role: "Customer" });
    await user.save();
    res.json({ id: user._id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
