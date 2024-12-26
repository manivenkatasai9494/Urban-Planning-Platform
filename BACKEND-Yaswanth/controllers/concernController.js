const asyncHandler = require("express-async-handler");
const Group = require("../models/groupModel");
const User = require("../models/userModel");
const Concern = require("../models/concernModel");

// @desc get an event
// @route GET /api/events/:eventId
// @access private
const getConcerns = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const group  = await Group.findById(req.user.currentGroup);
  const concerns = await Concern.find({groupId: req.user.currentGroup});
  if (!concerns) {
    res.status(404);
    throw new Error("No concerns available");
  }
  if (!group.admins.includes(user.id)) {
    res.status(403);
    throw new Error("Unauthorized access: user not an admin");
  }
  res.status(200).json(concerns);
});

// @desc ccreate an concern
// @route GET /api/events/:eventId
// @access private
const createConcern = asyncHandler(async (req, res) => {
    const {location, desc, level, phone } = req.body;
    if(!location || ! desc || ! level || !phone) {
        res.status(400);
        throw new Error("Bad request");
    }
    const concern = await Concern.create({
        groupId: req.user.currentGroup,
        desc: desc,
        location: location,
        level: level,
        phone: phone
    });
    res.status(201).json(concern);
  });


module.exports = {
  getConcerns,
  createConcern
};
