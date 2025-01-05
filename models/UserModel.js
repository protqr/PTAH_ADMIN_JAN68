import mongoose from "mongoose";

const AdminPTAHSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: "lastName",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "admin",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},
  { collection: "AdminPTAH",
    timestamps: true }
);

AdminPTAHSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", AdminPTAHSchema);