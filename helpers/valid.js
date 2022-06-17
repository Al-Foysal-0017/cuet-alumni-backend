const { check } = require("express-validator");
exports.validSign = [
  check("first_name", "First Name is required").notEmpty(),
  check("last_name", "Last Name is required").notEmpty(),
  // .isLength({
  //   min: 3,
  //   max: 16,
  // })
  // .withMessage("name must be between 3 to 32 characters"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password", "password is required").notEmpty(),
  check("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("password must contain a number"),
  check("department", "Department Name is required").notEmpty(),
  check("batch", "Batch is required").notEmpty(),
  check("graduation_year", "Graduation Year is required").notEmpty(),
  check("mobile", "Mobile Number is required").notEmpty(),
  check("country", "Country is required").notEmpty(),
  check("blood", "Blood Group Name is required").notEmpty(),
  check("avatar", "Avatar Image is required").notEmpty(),
];

exports.validLogin = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password", "password is required").notEmpty(),
  check("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("password must contain a number"),
];

exports.forgotPasswordValidator = [
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Must be a valid email address"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least  6 characters long"),
];
