const mongoose = require("mongoose");

const projectFeedbackSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: [true, "Message required"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectFeedback", projectFeedbackSchema);
