const mongoose = require("mongoose");

const concernSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    location: { type: String, required: [true, "Location is required"] },
    desc: { type: String, required: true },
    level: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Concern", concernSchema);
