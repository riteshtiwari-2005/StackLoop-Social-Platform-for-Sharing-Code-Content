const express = require("express");
const router = express.Router();
const jwtmiddleware = require("../middleware/jwt");
const authMiddleware = require("../middleware/jwt");
const multer=require("multer")

const postController = require("../controllers/postController");
 const cloudinary=require("../config/cloudanary")
const {CloudinaryStorage}=require("multer-storage-cloudinary")

// console.log("uploads",upload);


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Stackloop",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
}); 

const upload = multer({storage}); // Configure multer to save to an uploads folder (or use memory storage)
 


// 🔐 Get all posts
router.get("/posts", authMiddleware, postController.getAllPosts);

// 🔐 Get premium posts
router.get("/posts/premium", authMiddleware, postController.premiumPost);

// Create new post
router.post("/posts/create", jwtmiddleware, upload.single("image"), postController.createPost);

// Get single post
router.get("/posts/:postid", jwtmiddleware, postController.getPostById);

// Get username of post author
router.get("/postuser/:username", authMiddleware, postController.getPostUser);

// Get my posts (Moved from userRoutes)
router.get("/me/post", authMiddleware, postController.getMyPosts);

// Like post

router.post("/posts/like/:postid", jwtmiddleware, postController.likepost);
router.post("/recentpost/:username",jwtmiddleware,postController.recentpost)

// creates  order 
router.post("/api/payment/create-order",jwtmiddleware,postController.createOrder )
// verify   order 
router.post("/api/payment/verify",jwtmiddleware,postController.verifyPayment  )


module.exports = router;