import mongoose from "mongoose";
import { TYPEPOSTURES } from "../utils/constants.js";

const NotificationSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: Object.values(TYPEPOSTURES),
      default: TYPEPOSTURES.TYPE_1,
    },
    nameNoti: String,
    noPostures: String,
    Description: String,
    imageUrls: [String], // Changed from imageUrl: String
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);

// import mongoose from "mongoose";
// import { TYPEPOSTURES } from "../utils/constants.js";

// const PostureSchema = new mongoose.Schema(
//   {
//     userType: {
//       type: String,
//       enum: Object.values(TYPEPOSTURES),
//       default: TYPEPOSTURES.TYPE_1,
//     },
//     namePostures: String,
//     noPostures: String,
//     Description: String,
//     imageUrl: String,
//     videoUrl: String,
//     createdBy: {
//       type: mongoose.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Posture", PostureSchema);
