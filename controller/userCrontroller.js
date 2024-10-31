const { sendEmail } = require("../config/SendMail.config");
const userModel = require("../models/user-model");
const createError = require("../utils/errorhander");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const {cloudinary} = require('../config/cloudinaryConfig');


//^ Register-User
module.exports.registerUser = async (req, res, next) => {
    try {
      const { name, email, password, avatar } = req.body;
  
      // Check if user already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        console.log("existingUser", existingUser);
        return next(createError("User already registered", 404));
      }
  
      // Upload avatar to Cloudinary
      const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
  
      // Create new user in database
      const RegisterUser = await userModel.create({
        name,
        email,
        password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });
  
      // Generate token and send response
      generateToken(RegisterUser, 201, "User registered successfully", res);
    } catch (error) {
      console.error("Error in register API:", error);
      res.status(500).json({ success: false, message: "An error occurred during registration." });
    }
  };

//^ login user
module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(createError("'Please enter your email! & password!", 400));
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      console.log("existingUser", user);
      return next(createError("invalid email and passsword!", 404));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("existingUser", user);
      return next(createError("invalid email and passsword!", 404));
    }

    user.loginCount = (user.loginCount || 0) + 1; //& how many times user login
    await user.save();

    generateToken(user, 201, "Login successful!", res);
  } catch (error) {
    console.error("Error in register API:", error);
    res.status(500).json({ success: false, data: {}, message: "An error occurred during registration." });
  }
};

//! Log-Out
module.exports.logoutUser = (req, res) => {
  res.cookie("token", null, { expiresIn: new Date(Date.now()), httpOnly: true });
  res.status(200).json({
    success: true,
    message: "Logoued out successfully!",
  });
};

//! ForgetPassword
module.exports.forgetPassword = async (req, res, next) => {
  let user;
  try {
    const user = await userModel.findOne({ email: req.body.email });
    console.log("user->",user);
    

    if (!user) {
      return next(createError("User not found!", 404));
    }

    // Get resetPasswordToken
    const resetToken = user.getResetPasswordToken();
       user.save({ validateBeforeSave: false });

    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const resetPasswordUrl = `${process.env.FRENTED_URL}/password/reset/${resetToken}`;

const message = `Your Password Reset Token is:<br/> ${resetPasswordUrl}<br/>If you did not request this email, please ignore it.`;

const templateData = {
  user: {
    name: user.name,
  },
  resetPasswordUrl, // Pass the reset URL
};


const options = {
  email: user.email,
  subject: `Ecommerce Password Recovery`,
  templateData, // Pass the HTML message
};

await sendEmail(options);


    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // Reset the token and expiration in case of an error
    if (user) {
      user.resetpasswordToken = undefined;
      user.resetpasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }

    console.error("Error in ForgetPassword API:", error);
    return next(createError("An error occurred during ForgetPassword.", 500));
  }
};

//!reset password
module.exports.resetPassword = async (req, res, next) => {
  try {
    //^ createing token hash
    const token = req?.params?.token;
    const resetpasswordToken = crypto?.createHash("sha256").update(token).toString("hex");

    const user = await userModel?.findOne({ resetpasswordToken, resetpasswordExpire: { $gt: Date.now() } });
    if (!user) {
      return next(createError("Reset Password Token Is Invalid or Has Been Expire!", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
      return next(createError("Password does not  Match", 400));
    }
    user.password = req.body?.password;

    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save();

    generateToken(user, 200, "Password Change successfully", res);
  } catch (error) {
    console.error("Error in register API:", error);
    res.status(500).json({ success: false, data: {}, message: "An error occurred during Password reset." });
  }
};

//^ Update User Psddword
module.exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const userID = req.user.id;
    const user = await userModel.findById(userID).select("+password");
    if (!user) {
      return next(createError("User Not Found", 404));
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      console.log("existingUser", user);
      return next(createError("oldPassword is invalid!", 400));
    }
    if (newPassword !== confirmPassword) {
      return next(createError("Password does not match!", 400));
    }
    user.password = newPassword;
    await user.save();

    generateToken(user, 200, "Password Change successfully", res);
  } catch (error) {
    console.error("Error in updatePassword API:", error);
    res.status(500).json({ 
      success: false,
     data: {},
      message: "An error occurred during updatePassword." });
  }
};

//^ GET user Detail
module.exports.getUserDetail = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const user = await userModel.findById(userID);
    if (!user) {
      return next(createError("User Not Found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.json({ data: {}, success: false, message: error.message });
  }
};

//^ Update User profile
module.exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userID = req.user.id;

    if (!userID) {
      return next(createError("You are not authorized", 404));
    }

    const newUserData = { name, email };

   
    if (req.body.avatar && req.body.avatar !== "") {
      const user = await userModel.findById(userID);

      // Delete the existing avatar if available
      const imageId = user.avatar?.public_id;
      if (imageId) {
       
          const result = await cloudinary.uploader.destroy(imageId);  
        
        
      } else {
        console.log("No valid avatar found for deletion.");
      }

      // Upload new avatar to Cloudinary
      const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      // Set new avatar data
      newUserData.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    // Update user details in the database
    const user = await userModel.findByIdAndUpdate(userID, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.json({ success: false, message: error.message });
  }
};
