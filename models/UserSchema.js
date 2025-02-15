const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    profilePic: {
      type: String,
      default: "https://voxnews.com.br/wp-content/uploads/2017/04/unnamed.png",
    },
    coverPic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

UserSchema.add({
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  followings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  resetToken:{
    type:String,
    default:null
  },
  bio:String
})

module.exports = mongoose.model("User", UserSchema);
