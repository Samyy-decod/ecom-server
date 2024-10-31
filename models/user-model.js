const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require('bcrypt');
const createError = require('../utils/errorhander');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
      },
      email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        validate: [validator.isEmail, "Please Enter A Valid Email"],
        unique: true,
        trim: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        select: false, // Password hidden in query results
      },
      avatar: {
        public_id: {
          type: String,
          default: null,
        },
        url: {
          type: String,
          default: null,
        },
      },
      role: {
        type: String,
        enum: ["user", "admin", "subadmin"],
        default: "user",
      },
      resetpasswordToken: {
        type: String,
        default: null,
      },
      resetpasswordExpire: {
        type: Date,
        default: null,
      },
      loginCount: {
        type: Number,
        default: 0,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

//# Before saving user data, check if the password has changed.
//# If password is not changed, skip hashing; otherwise, hash it again.
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    try {
      const salt = await bcrypt.genSalt(11);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      return next(createError("Password hashing failed", 500));
    }
  });

//$ Method to create and return JWT Token
UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };

//^ compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

//^ password reset Token
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetpasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetpasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  
    return resetToken;
  };

module.exports = mongoose.model("User", UserSchema)