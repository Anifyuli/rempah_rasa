// routes/blog.js
import express from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controller/blogController.js";

const router = express.Router();

// Routes for blog posts
router
  .route("/")
  .get(getAllBlogs) // GET all blogs
  .post(createBlog); // CREATE new blog

router
  .route("/:id")
  .get(getBlogById) // GET single blog
  .put(updateBlog) // UPDATE blog
  .delete(deleteBlog); // DELETE blog

export default router;
