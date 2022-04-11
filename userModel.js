const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    googleID: { type: String},
    name: { type: String },
    email: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false},
    provider: { type: String },
  },
  { timestamps: true, collection: "user" }
);

module.exports = mongoose.model("User", userSchema);
