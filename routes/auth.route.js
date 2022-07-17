const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const {
  signinController,
  getAllUser,
  updateUserRole,
  signUp,
  verifyOtp,
  updateProfile,
  getUserDetails,
  logout,
  getSingleUser,
  deleteUser,
} = require("../controllers/auth.controller");

router.route("/signup").post(signUp);
router.route("/signup/verify").post(verifyOtp);

router.post("/signin", signinController);

router.route("/profile/update").put(isAuthenticatedUser, updateProfile);

//Get all users
router.get(
  "/admin/users/request",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllUser
);

router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/logout").get(logout);
// router.put(
//   "/admin/user/:id",
//   isAuthenticatedUser,
//   authorizeRoles("admin"),
//   updateUserRole
// );
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
