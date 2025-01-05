import { Router } from "express";
const router = Router();

import {
  getAllPost,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/PostController.js";
import {
  validatePostInput,
  validateIdParam5,
} from "../middleware/validationMiddleware.js";

router.route("/").get(getAllPost).post(validatePostInput, createPost);

router
  .route("/:_id")
  .get(validateIdParam5, getPost)
  .patch(validateIdParam5, updatePost)
  .delete(validateIdParam5, deletePost);

export default router;
