const Razorpay = require("../config/razorpay");
const Post = require("../models/Post");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Payment = require("../models/PaymentModel")
const crypto = require("crypto");

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPremium: false }).lean()
      .populate("author", "name email isPremium")
      .sort({ createdAt: -1 });
    console.log("posts", posts);

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

exports.premiumPost = async (req, res) => {
  try {
    // CHECK USER IS PRENIUM OR NOT
    const user = await User.findById(req.user.id);
    if (!user.isPremium) {
      return res.status(403).json({
        msg: "Access denied. Premium members only.",
      });
    }

    const posts = await Post.find({ isPremium: true }).lean()
      .populate("author", "name email isPremium")
      .sort({ createdAt: -1 });
    console.log("posts", posts);

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

    const { title, content, isPremium, image: bodyImage, tag,code ,tag1} = req.body;
    console.log(code)

    if (!title || !content ) {
      return res.status(400).json({
        msg: "Fields are required",
      });
    }
    console.log(req.body)

    // ✅ support both file upload and URL string
    const image = req.file ? req.file.path : (bodyImage || "");

    console.log("Saving Image:", image);

    const post = await Post.create({
      title,
      content,
      image,
      author: req.user.id,
      isPremium: isPremium === 'true' || isPremium === true || false,
      tags: [tag],
      language: tag1,
      code: code || ""
    });

    return res.status(201).json({
      msg: "Post created successfully",
      post,
    });

  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

//fetch based on tag

exports.fetchpostonTag = async (req,res) => {
  try {
    console.log(req.body)
    const { tag } = req.body;

    const userid = req.user.id;
    if (!tag) {
      return res.status(400).json({
        msg: "Fields are required",
      });
    }

    const userdata = await User.findOne({ _id: userid })
    const preniumpost = await Post.find({ isPremium: true, tags: tag }).sort({ createdAt: -1 })
    const normalpost = await Post.find({ isPremium: false, tags: tag }).sort({ createdAt: -1 })
    const copy = [...preniumpost, ...normalpost]

    return res.status(200).json({
      message: "true",
      post: userdata.isPremium ? copy : normalpost
    })
  }

  catch (err) {
  return res.status(500).json({
    message: "internal server error",
    err: err.message
  })
}
}


exports.getPostById = async (req, res) => {
  try {
    const { postid } = req.params;
    const userid = req.user.id;

    // 🔥 Add view only if not already present
    const post = await Post.findByIdAndUpdate(
      { _id: postid },
      { $addToSet: { views: userid } },
      { new: true }
    ).populate("author", " -password");
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


exports.recentpost = async (req, res) => {
  try {
    const username = req.params.username;
    const userdata = await Profile.findOne({ username: username }).populate("user")
    const userid = userdata.user._id;
    const postdata = await Post.find({ author: userid }).sort({ createdAt: -1 }).limit(2)
    return res.status(201).json({
      success: true,
      postdata,
      postcount: postdata.length
    })



  }

  catch (err) {
    return res.status(500).json({
      "message": "false",
      err: err
    })
  }
}

// prenium post feauture

exports.createOrder = async (req, res) => {
  try {
    console.log("triggered")
    const options = {
      amount: 500 * 100,
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    }

    const order = await Razorpay.orders.create(options)
    //save in db 


    await Payment.create({
      user: req.user.id,
      amount: 500,
      orderId: order.id,
      status: "created",
    });

    return res.json(order);







  }

  catch (err) {
    console.log(err)
    await res.status(500).json({
      message: false,
      error: err.message
    })
  }

}




exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // 🔐 verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ msg: "Invalid payment" });
    }

    // ✅ update payment
    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
    });

    const expiry = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = "paid";
    payment.expiresAt = expiry;

    await payment.save();

    // ✅ update user premium
    const user = await User.findById(payment.user);

    user.isPremium = true;
    user.premiumExpiresAt = expiry;

    await user.save();

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Verification failed" });
  }
};


