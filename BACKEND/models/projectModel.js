const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    title: { type: String, required: [true, "Title is required"] },
    desc: { type: String },
    proposedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    votes: {
      type: Number,
      default: 0
    },
    voted: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    funds: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
