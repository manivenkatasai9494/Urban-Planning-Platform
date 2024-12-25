const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  getEvent,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const router = express.Router();

router.use(validateToken);
router
  .route("/:eventId")
  .get(getEvent)
  .delete(deleteEvent)
  .put(updateEvent);
router
.route("/")
.post(createEvent)
.get(getAllEvents);

module.exports = router;
