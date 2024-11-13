const SupportRequest = require("../models/SupportRequest");
const User = require("../models/User");

exports.createRequest = async (req, res) => {
  const { userId, issueDescription } = req.body;
  const randomSupportEngineer = await User.aggregate([
    { $match: { role: "Support Engineer" } },
    { $sample: { size: 1 } },
  ]);
  try {
    const request = new SupportRequest({
      customerId: userId,
      issueDescription: issueDescription,
      supportEngineerId: randomSupportEngineer[0]._id,
    });
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getRequests = async (req, res) => {
  const { userId } = req.params;
  const userDetails = await User.findById(userId);
  try {
    if (!userDetails) return res.status(404).json({ msg: "User not found" });
    let results;
    if (userDetails.role === "Support Engineer") {
      results = await SupportRequest.find({ supportEngineerId: userId });
    } else if (userDetails.role === "Customer") {
      results = await SupportRequest.find({ customerId: userId });
    } else {
      results = await SupportRequest.find();
    }
    results = await Promise.all(
      results.map(async (result) => {
        const customerDetails = await User.findOne({
          _id: result.customerId,
        });
        return {
          ...result.toObject(),
          customerUsername: customerDetails.username,
        };
      })
    );
    console.log("resultss", results);

    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;
  try {
    const request = await SupportRequest.findById(requestId);
    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await SupportRequest.findByIdAndDelete(requestId);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    res.json("Deleted request successfully");
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
