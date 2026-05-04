const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    profilePic: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 200,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    socialLinks: {
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },

    // Optional but useful 🔥
    postsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;