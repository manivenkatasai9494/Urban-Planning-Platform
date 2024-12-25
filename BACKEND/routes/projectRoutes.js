const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  getProject,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getAllApprovedProjects
} = require("../controllers/projectController");
const {
  createProjectFeedback,
  deleteProjectFeedback,
  getAllFeedbacks
} = require("../controllers/projectFeedbackController")
const router = express.Router();

router.use(validateToken);
router
  .route("/:projectId")
  .get(getProject)
  .delete(deleteProject)
  .post(createProjectFeedback)
  .put(updateProject);
router
  .route("/:projectId/feedbacks")
  .get(getAllFeedbacks);
router
  .route("/:projectId/:feedbackId")
  .delete(deleteProjectFeedback);
router
  .route("/")
  .post(createProject)
  .get(getAllProjects);
router
  .route("/funds")
  .get(getAllApprovedProjects);

module.exports = router;
