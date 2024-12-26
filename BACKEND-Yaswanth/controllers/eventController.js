const asyncHandler = require("express-async-handler");
const Event = require("../models/eventModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");

// @desc get an event
// @route GET /api/events/:eventId
// @access private
const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  const user = await User.findById(req.user.id);
  if (!event) {
    res.status(404);
    throw new Error("No Events available");
  }
  if (event.groupId.toString() !== user.currentGroup.toString()) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.status(200).json(event);
});

// @desc get all events
// @route GET /api/events/
// @access private
const getAllEvents = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const events = await Event.find({ groupId: user.currentGroup });
  if (!events) {
    res.status(404);
    throw new Error("No Events available");
  }
  res.status(200).json(events);
});


// @desc post/create a Event
// @route POST /api/events
// @access private
const createEvent = asyncHandler(async (req, res) => {
  const { title, desc, date, location } = req.body;
  const user = await User.findById(req.user.id);
  if (!title || !date) {
    res.status(400);
    throw new Error("All the fields are required");
  }
  const group = await Group.findById(user.currentGroup);
  if (!group) {
    res.status(404);
    throw new Error("Group doesn't exist");
  }
  if (!group.admins.includes(user.id)) {
    res.status(403);
    throw new Error("Unauthorized user: Not an admin");
  }
  console.log(location);
  const event = await Event.create({
    groupId: user.currentGroup,
    title,
    desc,
    date,
    location,
  });
  res.status(201).json({ message: "Event created Successfully", event });
});

// @desc update a Event
// @route PUT /api/events/:eventId
// @access private
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  const user = await User.findById(req.user.id);
  const { title, desc, date, location } = req.body;
  if (!event) {
    res.status(404);
    throw new Error("No Events available");
  }
  const group = await Group.findById(event.groupId);
  if (group.id.toString() !== user.currentGroup.toString()) {
    res.status(404);
    throw new Error("Project not found");
  }
  if (!group.admins.includes(req.user.id)) {
    res.status(403);
    throw new Error("Unauthorized user: Not an admin");
  }
  event.title = title || event.title;
  event.desc = desc || event.desc;
  event.date = date || event.date;
  event.location = location || event.location;
  await event.save();
  res.status(200).json({ message: "Event updated Successfully", event });
});

// @desc delete a Event
// @route DELETE /api/Events/:EventId
// @access private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  const user = await User.findById(req.user.id);
  if (!event) {
    res.status(404);
    throw new Error("No Events available");
  }
  const group = await Group.findById(event.groupId);
  if (group.id.toString() !== user.currentGroup.toString()) {
    res.status(404);
    throw new Error("Project not found");
  }
  if (!group.admins.includes(req.user.id)) {
    res.status(403);
    throw new Error("Unauthorized user: Not an admin");
  }
  await Event.findByIdAndDelete(event.id);
  res.status(200).json({ message: "Event Deleted Successfully", event });
});

module.exports = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};
