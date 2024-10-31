const express = require("express");
const { isAutherenticatedUser,Autherizeroles } = require("../../middlewares/auth");
const { GetAllUser, GetsingleUser, updateUserRole, DeleteUser } = require("../../controller/adminCrontroller ");
const router = express.Router();

router.get("/admin/users",isAutherenticatedUser,Autherizeroles("admin","subadmin"), GetAllUser);    //# get all user
router.get("/admin/user/:id",isAutherenticatedUser,Autherizeroles('admin'), GetsingleUser);    //# Get single User

router.put("/admin/user/:id",isAutherenticatedUser,Autherizeroles('admin'), updateUserRole);    //# update User Role
router.delete("/admin/user/:id",isAutherenticatedUser,Autherizeroles('admin'), DeleteUser);    //!Delete User


module.exports = router;
