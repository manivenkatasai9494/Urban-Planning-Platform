const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  getAllApprovedProjects
} = require("../controllers/projectController");
const router = express.Router();

router.use(validateToken);
router
  .route("/")
  .get(getAllApprovedProjects);

module.exports = router;
