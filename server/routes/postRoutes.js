import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import express from "express";

import Post from "../mongodb/models/post.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//GET ALL POSTS

router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    console.log(posts);
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

//CREATE A POST
router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);

    const newPostData = {
      name,
      prompt,
      photo: photoUrl.secure_url, // Use photoUrl.secure_url to store the Cloudinary image URL
    };

    const newPost = new Post(newPostData);
    await newPost.save();
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

export default router;
