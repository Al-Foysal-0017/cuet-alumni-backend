const express = require("express");
const router = express.Router();

// Load Controllers
const {
  registerController,
  activationController,
  signinController,
  forgotPasswordController,
  resetPasswordController,
  googleController,
  facebookController,
  getAllUser,
  updateUserRole,
  registerController2,
  getUserRole,
  signUp,
  verifyOtp,
} = require("../controllers/auth.controller");

const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth.controller");

const {
  validSign,
  validLogin,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../helpers/valid");

router.route("/signup").post(signUp);
router.route("/signup/verify").post(verifyOtp);
router.post("/register", validSign, registerController);
// router.post("/register2", registerController2);

router.get("/test", (req, res) => {
  res.json({ msg: "Naiem Mohammad Al Foysal" });
});

router.post("/login", validLogin, signinController);

router.post("/activation", activationController);

// forgot reset password
router.put(
  "/forgotpassword",
  forgotPasswordValidator,
  forgotPasswordController
);
router.put("/resetpassword", resetPasswordValidator, resetPasswordController);

// Google and Facebook Login
router.post("/googlelogin", googleController);
router.post("/facebooklogin", facebookController);

//Get all users
router.get("/admin/users/request", requireSignin, adminMiddleware, getAllUser);

// router
//   .route("/admin/user/:id")
//   .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
// .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
//   .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.get("/role/user/:id", requireSignin, getUserRole);
router.put("/admin/user/:id", requireSignin, adminMiddleware, updateUserRole);

module.exports = router;
