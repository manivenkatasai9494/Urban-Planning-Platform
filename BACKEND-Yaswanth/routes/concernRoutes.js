const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  getConcerns,
  createConcern
} = require("../controllers/concernController");
const router = express.Router();

router.use(validateToken);
router
.route("/")
.get(getConcerns)
.post(createConcern);

module.exports = router;
