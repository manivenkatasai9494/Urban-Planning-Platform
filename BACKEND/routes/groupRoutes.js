const express = require("express");
const {
  getGroup,
  getAllGroups,
} = require("../controllers/groupController");
const router = express.Router();

router
  .route("/:groupId")
  .get(getGroup)
router
  .route("/")
  .get(getAllGroups);

module.exports = router;
