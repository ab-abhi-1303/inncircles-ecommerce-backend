const User = require("../models/User");
const SupportRequest = require("../models/SupportRequest");

exports.assignRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    if(!userId || !role) {
      return res.status(400).json({msg: "All params not passed"});
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    const userHasIssues = await SupportRequest.findOne({ customerId: userId });
    if(!userHasIssues) {  
      user.role = role;
      await user.save();
      res.json(user);
    }
    else{
      res.status(403).json({msg: "User already has tickets created"});
    } 
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'Admin' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.addUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if(!username || !password) {
      return res.status(400).json({msg: "Please pass username and password both"});
    }
    const users = await User.find({ username: username });
    if (users.length) return res.status(403).json({ msg: "User already exists" });
    const user = new User({ username, password, role: 'Customer' });
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
