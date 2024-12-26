const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: [true, "Name is required"] },
    phone: { type: String, required: [true, "Phone number is required"] },
    email: { type: String, required: [true, "email is required"] },
    password: { type: String, required: [true, "Password is required"] },
    currentGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    }, // Associated group ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
