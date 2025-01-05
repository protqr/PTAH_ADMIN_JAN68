import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please add post title"],
    },
    content: {
      type: String,
      required: [true, "please add post content"],
    },
    tag: {
      type: String,
      required: [true, "please add post tag"],
    },
    postedBy: {
      type: String,
      required: true,
    },
    comments: [
      {
        text: String,
        created: { type: Date, default: Date.now },
        postedBy: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
