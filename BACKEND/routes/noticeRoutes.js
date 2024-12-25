const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  getAllNotices,
  createNotice,
} = require("../controllers/noticeController");
const router = express.Router();

router.use(validateToken);
router
.route("/")
.post(createNotice)
.get(getAllNotices);

module.exports = router;
