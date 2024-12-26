const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: [true, "Message required"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
