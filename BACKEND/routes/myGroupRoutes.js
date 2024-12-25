const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  getMyGroups,
  createGroup,
  deleteGroup,
  updateGroup,
} = require("../controllers/groupController");
const router = express.Router();

router.use(validateToken);
router
  .route("/")
  .get(getMyGroups)
  .post(createGroup)
  router
  .route("/:groupId")
  .put(updateGroup)
  .delete(deleteGroup);

module.exports = router;
