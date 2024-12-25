const mongoose = require("mongoose");

const fundsSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    totalFunds: { type: Number, default: 0 },
    allocatedFunds: { type: Number, default: 0 }, // Object mapping project IDs to allocated funds
  },
  { timestamps: true }
);

module.exports = mongoose.model("Funds", fundsSchema);
