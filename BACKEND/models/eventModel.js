const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    title: { type: String, required: [true, "Event title is required"] },
    desc: { type: String, default:"" },
    date: { type: Date, required: [true, "Date is required"], default: Date.now() },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
