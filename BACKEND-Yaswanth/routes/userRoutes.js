const express = require("express");
const validateToken = require("../middleware/validateTokenHandler")

const {
  registerUser,
  loginUser,
  currentUser,
  changeCurrentGroup,
} = require("../controllers/userController");
const router = express.Router();

router.get("/current", validateToken, currentUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/group", validateToken, changeCurrentGroup);

module.exports = router;
