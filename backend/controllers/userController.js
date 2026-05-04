const Profile = require("../models/Profile");
const Post = require("../models/Post");

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Build the update object from text fields
    const updateData = {};
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;

    // Reconstruct nested socialLinks from FormData flat keys e.g. "socialLinks[twitter]"
    const socialLinks = {};
    if (req.body["socialLinks[twitter]"] !== undefined) socialLinks.twitter = req.body["socialLinks[twitter]"];
    if (req.body["socialLinks[linkedin]"] !== undefined) socialLinks.linkedin = req.body["socialLinks[linkedin]"];
    if (req.body["socialLinks[github]"] !== undefined) socialLinks.github = req.body["socialLinks[github]"];

    // If a file was uploaded via multer-storage-cloudinary, req.file.path is the Cloudinary URL
    if (req.file && req.file.path) {
      updateData.profilePic = req.file.path;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true }
    );

    return res.status(200).json({
      profile: updatedProfile,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

exports.viewProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profiledata = await Post.find({ author: userId }).countDocuments();

    const userdata = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { postsCount: profiledata } },
      { new: true }
    );

    return res.status(200).json({
      profile: userdata
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

exports.getProfileByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const userdata = await Profile.findOne({ username });

    if (!userdata) {
      return res.status(400).json({
        msg: "profile not found"
      });
    }
    return res.status(200).json({
      profile: userdata
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
