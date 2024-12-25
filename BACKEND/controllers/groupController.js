const asyncHandler = require("express-async-handler");
const Group = require("../models/groupModel");
const Event = require("../models/eventModel");
const Funds = require("../models/fundsModel");
const Feedback = require("../models/feedbackModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");

// @desc get a group
// @route GET /api/groups/:groupId
// @access public
const getGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.groupId);
  if (!group) {
    res.status(404);
    throw new Error("No Groups available");
  }
  res.status(200).json(group);
});

// @desc get all groups
// @route GET /api/groups/
// @access public
const getAllGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find();
  if (!groups) {
    res.status(404);
    throw new Error("No Groups available");
  }
  res.status(200).json(groups);
});

// @desc get all groups with user as admin
// @route GET /api/groups/my-groups
// @access private
const getMyGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({ admins: { $in: [req.user.id] } });
  const user = await User.findById(req.user.id);
  if (!groups) {
    res.status(404);
    throw new Error("No Groups available");
  }
  res.status(200).json(groups);
});

// @desc post/create a group
// @route POST /api/groups/my-groups
// @access private
const createGroup = asyncHandler(async (req, res) => {
  const { name, desc, location } = req.body;
  if (!name || !location) {
    res.status(400);
    throw new Error("All the fields are required");
  }
  const group = await Group.create({
    name,
    desc,
    location,
    admins: [req.user.id]
  });
  const funds = await Funds.create({
    groupId: group.id,
  });
  res.status(200).json(group);
});


// @desc update a group
// @route PUT /api/groups/my-groups/:groupId
// @access private
const updateGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { name, desc, addAdmin, deleteAdmin } = req.body;

  // Find the group by ID
  let group = await Group.findById(groupId);
  if (!group) {
    res.status(404).json({ message: "Group not found" });
    return;
  }
  if(!group.admins.includes(req.user.id)) {
    res.status(403);
    throw new Error("Unauthorized access: only admins can send PUT request");
  }
  if (name) {
    group.name = name;
  }
  if (desc) {
    group.desc = desc;
  }

  // Add new admin
  if (addAdmin) {
    group.admins.push(addAdmin);
  }
  // Remove admin
  if (deleteAdmin) {
    group.admins = group.admins.filter((adminId) => adminId.toString() !== deleteAdmin);
  }
  // Save the updated group
  await group.save();
  res.status(200).json({ message: "Group updated successfully", group });
});

// @desc delete a group
// @route DELETE /api/groups/my-groups/:groupid
// @access private
const deleteGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  // Find the group by ID and delete it
  const deletedGroup = await Group.findByIdAndDelete(groupId);

  if (!deletedGroup) {
    res.status(404).json({ message: "Group not found" });
    return;
  }
  if(!deletedGroup.admins.includes(req.user.id)) {
    res.status(403);
    throw new Error("Unauthorized access: only admins can delete this group");
  }

  // deleting associated data
  res.status(200).json({ message: "Group deleted successfully" });
  await Project.deleteMany({ groupId: groupId });
    await Event.deleteMany({ groupId: groupId });
    await Funds.deleteMany({ groupId: groupId });
    await Feedback.deleteMany({ groupId: groupId });
  await Project.deleteMany({ groupId: groupId });
});

module.exports = {
  getAllGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getMyGroups
};
