const express = require("express");
const { registerUser, loginUser, logoutUser, forgetPassword, resetPassword, getUserDetail, updatePassword, updateProfile } = require("../../controller/userCrontroller");
const { isAutherenticatedUser } = require("../../middlewares/auth");
const router = express.Router();


router.post("/register", registerUser);      //^ Register-User
router.post("/login", loginUser);       //^ login user
router.delete("/logout", logoutUser); //! Log-Out

router.post("/password/forgot", forgetPassword);    //^ForgetPassword
router.put("/password/reset/:token", resetPassword);     //^reset password
router.put("/password/update",isAutherenticatedUser,updatePassword);     //^updatePassword

router.get("/me",isAutherenticatedUser, getUserDetail);    //^ GET user Detail
router.put("/me/update",isAutherenticatedUser, updateProfile);    //^ update user profile




module.exports = router;
