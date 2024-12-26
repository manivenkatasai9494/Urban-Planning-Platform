const express = require('express');
const validateToken = require("../middleware/validateTokenHandler")
const {
    getFunds,
    updateFunds,
} = require("../controllers/fundsController");
const router = express.Router();

router.use(validateToken);
router.route("/").get(getFunds).put(updateFunds);

module.exports = router;
