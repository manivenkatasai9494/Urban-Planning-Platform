const express = require('express');
const validateToken = require("../middleware/validateTokenHandler")
const {
    createFeedback,
    deleteFeedback,
    getFeedback,
} = require("../controllers/feedbackController")
const router = express.Router();

router.use(validateToken);
router.route("/").post(createFeedback).get(getFeedback);
router.route("/:feedbackId").delete(deleteFeedback);

module.exports = router;
