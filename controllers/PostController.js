import { StatusCodes } from "http-status-codes";
import Post from "../models/PostModel.js";
import { NotFoundError } from "../errors/customError.js";

export const getAllPost = async (req, res) => {
  const { search, sort, isDeleted } = req.query;
  console.log(isDeleted);

  const queryObject = {};
  if (typeof isDeleted !== "undefined") {
    queryObject.isDeleted = isDeleted === "true";
  } else {
    queryObject.isDeleted = { $nin: [true] };
  }
  if (search) {
    queryObject.$or = [{ title: { $regex: search, $options: "i" } }];
    queryObject.$or = [{ postedBy: { $regex: search, $options: "i" } }];
  }

  const sortOptions = {
    ใหม่ที่สุด: "-createdAt",
    เก่าที่สุด: "createdAt",
    "เรียงจาก ก-ฮ": "-name",
    "เรียงจาก ฮ-ก": "name",
  };

  const sortKey = sortOptions[sort] || sortOptions.ใหม่ที่สุด;

  // แบ่งหน้า

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit); // ลบ { createdBy: req.user.userId } เพื่อค้นหาข้อมูลทั้งหมด
  const totalPosts = await Post.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalPosts / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalPosts, numOfPages, currentPage: page, posts });
};

export const createPost = async (req, res) => {
  const { postedBy } = req.body;

  const existingPost = await Post.findOne({ postedBy });
  if (existingPost) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "postedBy already exists" });
  }
  // If postedBy does not exist, proceed to create new post
  req.body.createdBy = req.user.userId;
  const postuser = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json({ postuser });
};

export const getPost = async (req, res) => {
  const post = await Post.findById(req.params._id);
  if (!post) throw new NotFoundError(`no post with id : ${_id}`);
  res.status(StatusCodes.OK).json({ post });
};

export const updatePost = async (req, res) => {
  const updatedPost = await Post.findByIdAndUpdate(
    req.params._id,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedPost)
    throw new NotFoundError(`no post with id : ${req.params._id}`);

  res.status(StatusCodes.OK).json({ post: updatedPost });
};


export const deletePost = async (req, res) => {
  const { _id } = req.params;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedPost) {
      throw new NotFoundError(`no post with id : ${_id}`);
    }

    res.status(StatusCodes.OK).json({ post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};
