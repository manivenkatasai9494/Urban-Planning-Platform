const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const ProjectFeedback = require("../models/projectFeedbackModel");
const User = require("../models/userModel");

// @desc post a feedback on project
// @route GET /api/projects/:projectId/feedbacks
// @access private
const getAllFeedbacks = asyncHandler(async (req, res) => {
  const feedbacks = await ProjectFeedback.find({projectId: req.params.projecId})
  if(!feedbacks) {
    
  }
  res.status(201).json(feedbacks);
});

// @desc post a feedback on project
// @route POST /api/projects/:projectId
// @access private
const createProjectFeedback = asyncHandler(async (req, res) => {
  const {message} = req.body;
  const user = await User.findById(req.user.id);
  if(!message) {
    res.status(400);
    throw new Error("Message is required");
  }

  const feedback = await ProjectFeedback.create({
    groupId: user.currentGroup,
    projectId: req.params.projectId,
    userId: user.id,
    message: message,
  });
  res.status(201).json(feedback);
});

// @desc delete a feedback
// @route DELETE /api/projects/:projectId/:feedbackId
// @access private
const deleteProjectFeedback = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const feedback = await ProjectFeedback.findById(req.params.feedbackId);
  if(feedback.userId.toString() !== user.id.toString()) {
    res.status(403);
    throw new Error("Unauthorized user: Feedback can't be deleted");
  }

  await ProjectFeedback.findByIdAndDelete(feedback.id);
  res.status(200).json(feedback);
});


module.exports = {
  createProjectFeedback,
  deleteProjectFeedback,
  getAllFeedbacks
};
