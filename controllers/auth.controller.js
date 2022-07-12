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
const expressJWT = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandling");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const ErrorHander = require("../utils/errorhander");

// OTP Request For SignUp
module.exports.signUp = async (req, res) => {
  const user = await User.findOne({
    number: req.body.number,
  });

  if (user) {
    return res.status(400).send("User already registered!");
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
  // greenwebsms.append("message", `আপনার ওটিপি: ${OTP}`);
  // axios
  //   .post("http://api.greenweb.com.bd/api.php", greenwebsms)
  //   .then((response) => {
  //     console.log(response.data);
  //   });

  const otp = new Otp({ number: number, password, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  return res.status(200).send("Otp send successfully.");
};

// Verify OTP
module.exports.verifyOtp = async (req, res) => {
  // res.set("Access-Control-Allow-Origin", "*");
  const otpHolder = await Otp.find({
    number: req.body.number,
  });
  if (otpHolder.length === 0) {
    return res.status(400).send("Your otp is expired. Please try again.");
  }
  const rightOtpFind = otpHolder[otpHolder.length - 1];
  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

  if (rightOtpFind.number === req.body.number && validUser) {
    const user = new User(_.pick(req.body, ["number", "password"]));
    const token = user.generateJWT();
    const result = await user.save();

    const OTPDelete = await Otp.deleteMany({
      number: rightOtpFind.number,
    });

    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    // end cookie

    return res.status(200).cookie("token", token, options).send({
      message: "User Registration Successfully.",
      token: token,
      data: result,
    });
  } else {
    return res.status(400).send("Your OTP was wrong.");
  }
};

exports.registerController = async (req, res) => {
  const {
    first_name,
    last_name,
    student_id,
    email,
    password,
    department,
    batch,
    graduation_year,
    mobile,
    country,
    blood,
    avatar,
  } = req.body;
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const firstError = error.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error: "Email is taken",
        });
      }
    });

    // const emailData = {
    //   from: process.env.EMAIL_FROM,
    //   to: email,
    //   subject: "Account activation link",
    //   html: `
    //             <h1>Please use the following to activate your account</h1>
    //             <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
    //             <hr />
    //             <p>This email may containe sensetive information</p>
    //             <p>${process.env.CLIENT_URL}</p>
    //         `,
    // };

    // sgMail
    //   .send(emailData)
    //   .then((sent) => {
    //     return res.json({
    //       message: `Email has been sent to ${email}`,
    //     });
    //   })
    //   .catch((err) => {
    //     return res.status(400).json({
    //       success: false,
    //       error: errorHandler(err),
    //     });
    //   });

    const user = new User({
      first_name,
      last_name,
      student_id,
      email,
      password,
      department,
      batch,
      graduation_year,
      mobile,
      country,
      blood,
      avatar,
    });

    const { _id } = user;

    const token = jwt.sign(
      {
        _id,
        first_name,
        last_name,
        student_id,
        email,
        password,
        department,
        batch,
        graduation_year,
        mobile,
        country,
        blood,
        avatar,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "15m",
      }
    );

    user.save((err, user) => {
      if (err) {
        console.log("Save error", errorHandler(err));
        return res.status(401).json({
          error: errorHandler(err),
        });
      } else {
        return res.json({
          success: true,
          // message: user,
          // _id,
          token,
          message: "Signup success",
        });
      }
    });
  }
};

exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log("Activation error");
        return res.status(401).json({
          error: "Expired link. Signup again",
        });
      } else {
        const {
          first_name,
          last_name,
          student_id,
          email,
          password,
          department,
          batch,
          graduation_year,
          mobile,
          country,
          blood,
          avatar,
        } = jwt.decode(token);

        // console.log(email);
        const user = new User({
          first_name,
          last_name,
          student_id,
          email,
          password,
          department,
          batch,
          graduation_year,
          mobile,
          country,
          blood,
          avatar,
        });

        user.save((err, user) => {
          if (err) {
            console.log("Save error", errorHandler(err));
            return res.status(401).json({
              error: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              // message: user,
              token,
              message: "Signup success",
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: "error happening please try again",
    });
  }
};

exports.signinController = (req, res) => {
  const { email, password } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const firstError = error.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    // check if user exist
    User.findOne({
      email,
    }).exec((err, user) => {
      const {
        _id,
        first_name,
        last_name,
        student_id,
        email,
        department,
        batch,
        graduation_year,
        mobile,
        country,
        blood,
        avatar,
        role,
      } = user;
      if (err || !user) {
        return res.status(400).json({
          error: "User with that email does not exist. Please signup",
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: "Email and password do not match",
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id,
          first_name,
          last_name,
          student_id,
          email,
          department,
          batch,
          graduation_year,
          mobile,
          country,
          blood,
          avatar,
          role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        token,
        message: "Signin success",
      });
    });
  }
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET, // req.user._id
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({
    _id: req.user._id,
  }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied.",
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const firstError = error.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "User with that email does not exist",
          });
        }

        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: "10m",
          }
        );

        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Password Reset link`,
          html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
        };

        return user.updateOne(
          {
            resetPasswordLink: token,
          },
          (err, success) => {
            if (err) {
              console.log("RESET PASSWORD LINK ERROR", err);
              return res.status(400).json({
                error:
                  "Database connection error on user password forgot request",
              });
            } else {
              sgMail
                .send(emailData)
                .then((sent) => {
                  // console.log('SIGNUP EMAIL SENT', sent)
                  return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
                  });
                })
                .catch((err) => {
                  // console.log('SIGNUP EMAIL SENT ERROR', err)
                  return res.json({
                    message: err.message,
                  });
                });
            }
          }
        );
      }
    );
  }
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    const firstError = error.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD,
        function (err, decoded) {
          if (err) {
            return res.status(400).json({
              error: "Expired link. Try again",
            });
          }

          User.findOne(
            {
              resetPasswordLink,
            },
            (err, user) => {
              if (err || !user) {
                return res.status(400).json({
                  error: "Something went wrong. Try later",
                });
              }

              const updatedFields = {
                password: newPassword,
                resetPasswordLink: "",
              };

              user = _.extend(user, updatedFields);

              user.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: "Error resetting user password",
                  });
                }
                res.json({
                  message: `Great! Now you can login with your new password`,
                });
              });
            }
          );
        }
      );
    }
  }
};

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
exports.googleController = (req, res) => {
  // const { idToken } = req.body;
  // client
  //   .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
  //   .then((response) => {
  //     // console.log('GOOGLE LOGIN RESPONSE',response)
  //     const { email_verified, name, email } = response.payload;
  //     if (email_verified) {
  //       User.findOne({ email }).exec((err, user) => {
  //         if (user) {
  //           const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
  //             expiresIn: "7d",
  //           });
  //           const { _id, email, name, role } = user;
  //           return res.json({
  //             token,
  //             user: { _id, email, name, role },
  //           });
  //         } else {
  //           let password = email + process.env.JWT_SECRET;
  //           user = new User({ name, email, password });
  //           user.save((err, data) => {
  //             if (err) {
  //               console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
  //               return res.status(400).json({
  //                 error: "User signup failed with google",
  //               });
  //             }
  //             const token = jwt.sign(
  //               { _id: data._id },
  //               process.env.JWT_SECRET,
  //               { expiresIn: "7d" }
  //             );
  //             const { _id, email, name, role } = data;
  //             return res.json({
  //               token,
  //               user: { _id, email, name, role },
  //             });
  //           });
  //         }
  //       });
  //     } else {
  //       return res.status(400).json({
  //         error: "Google login failed. Try again",
  //       });
  //     }
  //   });
};

exports.facebookController = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      const { email, name } = response;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });
          const { _id, email, name, role } = user;
          return res.json({
            token,
            user: { _id, email, name, role },
          });
        } else {
          let password = email + process.env.JWT_SECRET;
          user = new User({ name, email, password });
          user.save((err, data) => {
            if (err) {
              console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
              return res.status(400).json({
                error: "User signup failed with facebook",
              });
            }
            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = data;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          });
        }
      });
    })
    .catch((error) => {
      res.json({
        error: "Facebook login failed. Try later",
      });
    });
};

// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    // name: req.body.name,
    // email: req.body.email,
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

// Get User Role
exports.getUserRole = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  const { role } = user;

  res.status(200).json({
    success: true,
    role,
  });
});
