const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userScheama = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, "Mobile Number is required."],
    },
    firstName: {
      type: String,
      required: [true, "Please Enter Your First Name."],
    },
    lastName: {
      type: String,
      required: [true, "Please Enter Your Last Name."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    student_id: {
      type: String,
      trim: true,
      default: "###",
    },
    department: {
      type: String,
      trim: true,
      default: "###",
    },
    batch: {
      type: String,
      trim: true,
      default: "###",
    },
    graduation_year: {
      type: String,
      trim: true,
      default: "###",
    },
    country: {
      type: String,
      trim: true,
      default: "###",
    },
    blood: {
      type: String,
      trim: true,
      default: "###",
    },
    avatar: {
      type: String,
      trim: true,
      default:
        "https://wellbeingchirony.com/wp-content/uploads/2021/03/Deafult-Profile-Pitcher.png",
    },
    role: {
      type: String,
      default: "subscriber",
    },
  },
  { timestamps: true }
);

userScheama.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userScheama.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

// Compare Password
userScheama.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userScheama);
