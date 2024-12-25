const asyncHandler = require('express-async-handler');
const Feedback = require('../models/feedbackModel');
const User = require('../models/userModel');
const Group = require('../models/groupModel');
const { ObjectId } = require('mongodb');

// @desc get all feedbacks
// @route GET /api/feedback
// @access private
const getFeedback = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.user.currentGroup);
  const feedbacks = await Feedback.find({groupId: group.id})
  if(!feedbacks) {
    res.status(404);
    throw new Error("NOt found: feedbacks for your group not found");
  }

  res.status(200).json(feedbacks);
});


// @desc create a feedback
// @route POST /api/feedback
// @access private
const createFeedback = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const user = await User.findById(req.user.id);
  if (!message) {
    res.status(400);
    throw new Error('Message required');
  }

  const feedback = await Feedback.create({
    groupId: user.currentGroup,
    userId: user.id,
    message: message,
  });

  res.status(201).json(feedback);
});


// @desc delete a feedback
// @route DELETE /api/feedback/:feedbackId
// @access private
const deleteFeedback = asyncHandler(async (req, res) => { 
  const feedback = await Feedback.findById(req.params.feedbackId);
  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }
  const user = User.findById(req.user.id);
  const group = Group.findById(feedback.groupId);
  if(group && (group.admins.includes(user.id))) {
    await feedback.remove();
  } else {
    if(group) {
        res.status(403);
        throw new Error("Unauthorized user: user is not an admin of the group");
    } else {
        res.status(404);
        throw new Error("Invalid groupId: Group not found");
    }
  }

  res.status(200).json(feedback);
});

module.exports = {
  createFeedback,
  deleteFeedback,
  getFeedback
};
