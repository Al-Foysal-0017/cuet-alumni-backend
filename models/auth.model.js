const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// const userScheama = new mongoose.Schema(
//   {
//     first_name: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     last_name: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     student_id: {
//       type: Number,
//       trim: true,
//       required: true,
//     },
//     email: {
//       type: String,
//       trim: true,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     department: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     batch: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     graduation_year: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     mobile: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     country: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     blood: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     avatar: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     hashed_password: {
//       type: String,
//       required: true,
//     },
//     salt: String,
//     role: {
//       type: String,
//       default: "subscriber",
//     },
//     resetPasswordLink: {
//       data: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// virtual
const userScheama = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "abcde@gmail.com",
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
      // required: true,
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

// userScheama
//   .virtual("password")
//   .set(function (password) {
//     this._password = password;
//     this.salt = this.makeSalt();
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   });

// // methods
// userScheama.methods = {
//   authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },

//   encryptPassword: function (password) {
//     if (!password) return "";
//     try {
//       return crypto
//         .createHmac("sha1", this.salt)
//         .update(password)
//         .digest("hex");
//     } catch (err) {
//       return "";
//     }
//   },

//   makeSalt: function () {
//     return Math.round(new Date().valueOf() * Math.random()) + "";
//   },
// };

userScheama.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );
  return token;
};

module.exports = mongoose.model("User", userScheama);
