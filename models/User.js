const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["user"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  phonenumber: {
    type: String,
    default: "123",
  },
  country: {
    type: String,
    default: "country",
  },
  city: {
    type: String,
    default: "city",
  },
  location: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("User", userSchema);
