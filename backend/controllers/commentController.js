const Post = require("../models/Post");
const Comment = require("../models/Comments");

exports.addComment = async (req, res) => {
  try {
    const userid = req.user.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "Text is required" });
    }

    const commentsaved = await Comment.create({
      text,
      post: req.params.postid,
      user: userid
    });

    await Post.findByIdAndUpdate(
      req.params.postid,
      {
        $push: { comments: commentsaved._id }
      }
    );

    const populatedComment = await Comment.findById(commentsaved._id).populate("user", "email name");

    return res.status(201).json({
      msg: "Comment created",
      commentsaved: populatedComment
    });

  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const postid = req.params.postid;

    const comments = await Comment
      .find({ post: postid })
      .populate("user", "email name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      msg: "Comments fetched",
      comments
    });

  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
};
