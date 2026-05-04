const Post = require("../models/Post");
const Profile = require("../models/Profile");


exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().lean()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
      console.log("posts",posts);

    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        let username = null;
        if (post.author) {
          const profile = await Profile.findOne({
            user: post.author._id,
          }).select("username -_id").lean();
          username = profile?.username || null;
        }

        return {
          ...post,
          author: post.author ? {
            ...post.author,
            username,
          } : null,
        };
      })
    );

    return res.status(200).json({
      message: "All posts fetched successfully",
      posts: updatedPosts,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    console.log("FILE:", req.file); // ✅ correct logging

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        msg: "Fields are required",
      });
    }

    // ✅ safe access
    const image = req.file ? req.file.path : "";

    console.log("Image URL:", image);

    const newpost = await Post.create({
      title,
      content,
      image,
      author: req.user.id,
    });

    return res.status(201).json({
      msg: "Post created successfully",
      newpost,
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { postid } = req.params;
    const userid = req.user.id;

    // 🔥 Add view only if not already present
    const post = await Post.findByIdAndUpdate(
      { _id: postid },
      { $addToSet: { views: userid } },
      { new: true }
    ).populate("author"," -password");
    console.log(post);


    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    return res.status(200).json({
      msg: "Post fetched successfully",
      post,
      viewsCount: post.views.length, // optional
    });

  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getPostUser = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await Profile.findOne({ username });
    return res.status(200).json({
      user
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const { id } = req.user;
    const postdetail = await Post.find({ author: id });
    return res.status(200).json({
      post: postdetail
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
};

exports.likepost = async (req, res) => {
  try {
    const { postid } = req.params;
    const userid = req.user.id;
    const post = await Post.findById(postid);
    const liked = post.likes.includes(userid);
    if (liked) {
      await Post.findByIdAndUpdate(postid, { $pull: { likes: userid } })
      return res.status(200).json({
        msg: "Post unliked successfully",
      });
    }
    else {
      await Post.findByIdAndUpdate(postid, { $push: { likes: userid } })
      return res.status(200).json({
        msg: "Post liked successfully",
      });
    }



  }

  catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
}


exports.recentpost=async (req,res)=>{
  try{
     const username=req.params.username;
     const userdata=await Profile.findOne({username:username}).populate("user")
     const userid=userdata.user._id;
     const postdata=await Post.find({author:userid}).sort({createdAt:-1}).limit(2)
     return res.status(201).json({
      success:true,
      postdata,
      postcount:postdata.length
     }) 



  }

  catch(err)
  {

  }
}

