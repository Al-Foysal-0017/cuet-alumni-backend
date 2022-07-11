const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = Schema(
  {
    number: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      default: "No First Name",
    },
    lastName: {
      type: String,
      default: "No Last Name",
    },
    password: {
      type: String,
      required: true,
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
      default: "###",
    },
    role: {
      type: String,
      default: "subscriber",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15d" }
  );
  return token;
};

module.exports.User = model("testUser", userSchema);
