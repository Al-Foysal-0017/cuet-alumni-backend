const User = require("../models/auth.model");
const Otp = require("../models/otpModel");
const bcrypt = require("bcrypt");
const axios = require("axios");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const otpGenerator = require("otp-generator");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const sendToken = require("../utils/jwtToken");

// SignUp & OTP REQUEST
exports.signUp = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.number) {
    return next(new ErrorHander("Please provide a mobile number.", 400));
  }

  const user = await User.findOne({
    number: req.body.number,
  });

  if (user) {
    return next(new ErrorHander("User already registered!", 400));
  }

  const OTP = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const number = req.body.number;
  const password = req.body.password;
  console.log(OTP);

  // sending sms
  // const greenwebsms = new URLSearchParams();
  // greenwebsms.append(
  //   "token",
  //   "8229165538165745053879f2e330f24bc412f612809d26591919"
  // );
  // greenwebsms.append("to", `+88${number}`);
  // greenwebsms.append(
  //   "message",
  //   `চুয়েট অ্যালুমনাই এ নিবন্ধনের জন্য আপনার ওটিপি (OTP) কোড: ${OTP}`
  // );
  // axios
  //   .post("http://api.greenweb.com.bd/api.php", greenwebsms)
  //   .then((response) => {
  //     console.log(response.data);
  //   });

  const otp = new Otp({ number: number, password, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  // return res.status(200).send("Otp send successfully.");
  return res.status(200).send(`Otp send successfully. OTP is: ${OTP}`);
});

// SignUp & Verify OTP
exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const otpHolder = await Otp.find({
    number: req.body.number,
  });
  if (otpHolder.length === 0) {
    return res.status(400).send("Your otp is expired. Please try again.");
  }
  const rightOtpFind = otpHolder[otpHolder.length - 1];
  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

  if (rightOtpFind.number === req.body.number && validUser) {
    const user = new User(
      _.pick(req.body, ["number", "password", "firstName", "lastName"])
    );
    const result = await user.save();

    const OTPDelete = await Otp.deleteMany({
      number: rightOtpFind.number,
    });

    sendToken(user, 201, res);
  } else {
    return res.status(400).send("Your OTP was wrong.");
  }
});

// SignIn
exports.signinController = catchAsyncErrors(async (req, res, next) => {
  const { number, password } = req.body;

  if (!number) {
    return next(new ErrorHander("Mobile Number is Required.", 400));
  }
  if (!password) {
    return next(new ErrorHander("Password is Required.", 400));
  }

  const user = await User.findOne({
    number: req.body.number,
  });

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// // update User Role -- Admin
// exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
//   const newUserData = {
//     // name: req.body.name,
//     // email: req.body.email,
//     role: req.body.role,
//   };

//   await User.findByIdAndUpdate(req.params.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//   });
// });

// // Get User Role
// exports.getUserRole = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   const { role } = user;

//   res.status(200).json({
//     success: true,
//     role,
//   });
// });

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Load User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    // name: req.body.name,
    number: req.body.number,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  // const imageId = user.avatar.public_id;

  // await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
