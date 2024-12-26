const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Group = require("../models/groupModel");

// @desc login a user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
          currentGroup: user.currentGroup
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );
    res.json({ accessToken });
  } else {
    res.status(401);
    throw new Error("InValid email and password");
  }
});

// @desc get current user
// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
  if(!req.user) {
    res.status(401);
    throw new Error("UnAuthorized user");
  }
  const user = await User.findById(req.user.id);
  if(!req.user.currentGroup) {
    res.status(404);
    throw new Error("Not found: user not in any group");
  }
  res.status(200).json(user);
});

// @desc register a user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, phone, password } = req.body;
  const availableUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (availableUser) {
    if (availableUser.phone === phone && availableUser.email === email) {
      res.status(400);
      throw new Error("Email and Phone number already in use");
    } else if (availableUser.phone === phone) {
      res.status(400);
      throw new Error("Phone number already in use");
    } else if (availableUser.email === email) {
      res.status(400);
      throw new Error("Email already in use");
    }
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    phone,
    email,
    password: hashedPassword,
  });
  if (!user) {
    res.status(400);
    throw new Error("User data invalid");
  } else {
    res
      .status(201)
      .json({ _id: user.id, username: user.username, email: user.email });
  }
});

// @desc update current group for the user
// @route PUT /api/users/group
// @access private
const changeCurrentGroup = asyncHandler(async (req, res) => {
  console.log("wiee");
  const { groupId } = req.body;
  const userId = req.user.id;
  if(!userId) {
    res.status(403);
    throw new Error("Unauthorized access");
  }
  const group = await Group.findById(groupId);
  if(!group) {
    res.status(404);
    throw new Error("Invalid group id: group doesn't exist");
  }
  
  // Update the currentGroup attribute for the user
  const user = await User.findById(userId);
  user.currentGroup = group.id;
  await user.save();

  res.status(200).json({ message: "Current group for the user updated successfully", user });
});

module.exports = { loginUser, registerUser, currentUser, changeCurrentGroup };
