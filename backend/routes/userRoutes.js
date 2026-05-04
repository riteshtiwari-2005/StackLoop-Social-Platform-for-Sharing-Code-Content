const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/jwt");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const couldinary=require("../config/cloudanary")
const {CloudinaryStorage}=require("multer-storage-cloudinary");
const multer = require("multer");

const storage=new CloudinaryStorage({
 cloudinary:couldinary,
 params:{
    folder:"profilepic",
    allowed_formats: ["jpg", "png", "jpeg"],
 }

})

const upload=multer({storage})

// 🔐 REGISTER
router.post("/register", authController.register);

// 🔐 LOGIN
router.post("/login", authController.login);

// Profile edit route
router.put("/editprofile", authMiddleware,upload.single("profilepic"), userController.editProfile);

// View Profile (updates post count)
router.post("/viewprofile", authMiddleware, userController.viewProfile);

// Get Profile by username
router.get("/profile/:username", authMiddleware, userController.getProfileByUsername);


module.exports = router;