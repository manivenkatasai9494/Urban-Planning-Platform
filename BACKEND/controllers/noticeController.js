const asyncHandler = require("express-async-handler");
const Notice = require("../models/noticeModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");



// @desc get all events
// @route GET /api/events/
// @access private
const getAllNotices = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const notices = await Notice.find({ groupId: user.currentGroup });
  if (!notices) {
    res.status(404);
    throw new Error("No Events available");
  }
  res.status(200).json(notices);
});


// @desc post/create a Event
// @route POST /api/events
// @access private
const createNotice = asyncHandler(async (req, res) => {
  const { title, desc } = req.body;
  const user = await User.findById(req.user.id);
  if (!title || !desc) {
      res.status(400);
      throw new Error("All the fields are required");
    }
    const group = await Group.findById(user.currentGroup._id);
    if (!group) {
        res.status(404);
        throw new Error("Group doesn't exist");
    }
  if (!group.admins.includes(user.id)) {
    res.status(403);
    throw new Error("Unauthorized user: Not an admin");
  }
  const notice = await Notice.create({
    groupId: user.currentGroup,
    title,
    desc,
  });
  res.status(201).json({ message: "Notice created Successfully", notice });
});


module.exports = {
  getAllNotices,
  createNotice,
};
