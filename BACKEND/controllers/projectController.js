const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Funds = require("../models/fundsModel");

// @desc get a project
// @route GET /api/projects/:id
// @access public
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  const user = await User.findById(req.user.id);
  if (!project) {
    res.status(404);
    throw new Error("No Projects available");
  }
  if (project.groupId.toString() !== user.currentGroup.toString()) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.status(200).json(project);
});

// @desc get all projects
// @route GET /api/projects/
// @access private
const getAllProjects = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const projects = await Project.find({ groupId: user.currentGroup });
  if (!projects) {
    res.status(404);
    throw new Error("No Projects available");
  }
  res.status(200).json(projects);
});


// @desc get all projects
// @route GET /api/projects/funds
// @access private
const getAllApprovedProjects = asyncHandler(async (req, res) => {
  console.log("in approved projects");
  const user = await User.findById(req.user.id);
  console.log("wiee");
  const projects = await Project.find({ groupId: user.currentGroup, status: "approved" });

  if (!projects) {
    res.status(404);
    throw new Error("No Projects available");
  }
  res.status(200).json(projects);
});

// @desc post/create a project
// @route POST /api/projects
// @access private
const createProject = asyncHandler(async (req, res) => {
  const { title, desc } = req.body;
  if (!title || !desc) {
    res.status(400);
    throw new Error("All the fields are required");
  }

  // Ensure user is authenticated and currentGroup is set
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user || !user.currentGroup) {
    res.status(403);
    throw new Error("Unauthorized user or current group not set");
  }

  // Create the project
  const project = await Project.create({
    groupId: user.currentGroup,
    title,
    desc,
    proposedBy: userId,
  });

  res.status(200).json({ message: "Project Added Successfully", project });
});

// @desc update a project
// @route PUT /api/projects/:id
// @access public
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  const user = await User.findById(req.user.id);
  if (!project) {
    res.status(404);
    throw new Error("No Projects available");
  }
  if (project.groupId.toString() !== user.currentGroup.toString()) {
    res.status(404);
    throw new Error("Project not found");
  }
  const { votes, funds } = req.body;
  const group = await Group.findById(project.groupId);
  if (funds) {
    if (
      project.proposedBy.toString() !== user.id.toString() &&
      !group.admins.includes(user.id)
    ) {
      res.status(403);
      throw new Error(
        "Unauthorized access: only admin/owner can delete project"
      );
    }
  }
  if (funds) {
    const fund = await Funds.findOne({ groupId: user.currentGroup });
    fund.allocatedFunds = fund.allocatedFunds + funds;
    await fund.save();
  }
  if (votes && votes - project.votes === 1 && project.voted.includes(user.id)) {
    res.status(403);
    throw new Error("Forbidden: You have already voted");
  }
  let updateStatus;
  project.voted.push(user.id);
  if(funds) {
    updateStatus = "approved"
  }
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.projectId,
    {
      votes: votes || project.votes,
      $push: { voted: req.user.id }, // Add the user's ID to the voted array
      status: updateStatus || project.status, // Update the status field with the value from req.body
      funds: funds || project.funds,
    },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "Project Updated Successfully", updatedProject });
});

// @desc delete a project
// @route DELETE /api/projects/:projectId
// @access public
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  const user = await User.findById(req.user.id);
  if (!project) {
    res.status(404);
    throw new Error("No Projects available");
  }
  if (project.groupId.toString() !== user.currentGroup.toString()) {
    res.status(404);
    throw new Error("Project not found");
  }
  const group = await Group.findById(project.groupId);
  if (
    project.proposedBy.toString() !== user.id.toString() &&
    !group.admins.includes(user.id)
  ) {
    res.status(403);
    throw new Error("Unauthorized access: only admin/owner can delete project");
  }
  await Project.findByIdAndDelete(project.id);
  // code pending for this
  res.status(200).json({ message: "Project Deleted Successfully", project });
});

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getAllApprovedProjects,
};
