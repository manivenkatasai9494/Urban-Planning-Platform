const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    title: { type: String, required: [true, "Event title is required"] },
    desc: { type: String, default:"" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
