const asyncHandler = require("express-async-handler");
const Group = require("../models/groupModel");
const User = require("../models/userModel");
const Funds = require("../models/fundsModel");

// @desc get funds
// @route GET /api/funds
// @access private
const getFunds = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const group = await Group.findById(user.currentGroup);

  if (!group) {
    res.status(404);
    throw new Error("Not Found: User not in any group");
  }
  const funds = await Funds.findOne({ groupId: group.id });
  res.status(200).json(funds);
});

// @desc update funds for a group
// @route PUT /api/funds
// @access public
const updateFunds = asyncHandler(async (req, res) => {
  const { addFunds, totalFunds } = req.body;
  if (!totalFunds && !addFunds) {
    res.status(400);
    throw new Error(
      "Bad Request: projectId and allocatedAmount OR totalFunds are required"
    );
  }

  const user = await User.findById(req.user.id);
  const group = await Group.findById(user.currentGroup);

  if (!group) {
    res.status(404);
    throw new Error("Not Found: User not in any group");
  }
  if(!group.admins.includes(user.id)) {
    res.status(403);
    throw new Error("Unauthorized user: user not admin for the group");
  }

  const funds = await Funds.findOne({ groupId: group.id });

  if (!funds) {
    res.status(404);
    throw new Error("Not Found: Funds not available for the group");
  }

  // Update allocated funds for the project
  if (addFunds) {
    funds.totalFunds = funds.totalFunds + addFunds;
  }
  if (totalFunds) {
    funds.totalFunds = totalFunds;
  }
  await funds.save();

  res.status(200).json({ message: "Funds updated successfully", funds });
});

module.exports = { getFunds, updateFunds };
