
const userModel = require('../models/user-model');
const createError = require('../utils/errorhander');
const {cloudinary} = require('../config/cloudinaryConfig');



//^ Get All User. --(admin)
module.exports.GetAllUser = async (req, res, next) => {
    try {

        const users = await userModel.find()
        if (!users) {
            return next(createError("User Not Found", 404))
        }

        res.status(200).json({
            success: true,
            message: "All User Found SuccessFully!",
            users,
        })

    } catch (error) {
        return res.json({ data: {}, success: false, message: error.message })
    }
}


//^ Get single User. --(admin)
module.exports.GetsingleUser = async (req, res, next) => {
    try {

        const user = await userModel.findById(req.params.id)
        if (!user) {
            return next(createError(`User Dose Not Exist With Id ${req.params.id}`, 404))
        }

        res.status(200).json({
            success: true,
            message: " User Found SuccessFully!",
            user,
        })

    } catch (error) {
        return res.json({ data: {}, success: false, message: error.message })
    }
}



//^ Update User role --(admin)
module.exports.updateUserRole = async (req, res, next) => {

    try {
        const userID = req.params.id;
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
          };
          console.log("newUserData=>",newUserData)
        const user = await userModel.findByIdAndUpdate(userID, newUserData, { new: true, runValidators: true, useFindAndModify: false })
        if(!user){
            return next(createError("User Cannot Update", 404));
        }

        res.status(200).json({success: true})

    } catch (error) {
        return res.json({ data: {}, success: false, message: error.message })
    }
}



//^ Delete user --(admin)

module.exports.DeleteUser = async (req, res, next) => {
    try {
      const userID = req.params.id;
      const user = await userModel.findById(userID);
  
      if (!user) {
        return next(createError(`User does not exist with ID ${req.params.id}`, 400));
      }
  
      //! Delete the user's avatar from Cloudinary if it exists
      const imageId = user.avatar?.public_id;

      if (imageId) {
        try {
         await cloudinary.uploader.destroy(imageId);
        } catch (error) {
          console.error("Cloudinary error:", error);
          return next(createError("Failed to delete avatar from Cloudinary", 500));
        }
      }
  
      //#Delete the user from the database
      await userModel.findByIdAndDelete(userID);
  
      res.status(200).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      console.error("Error in delete user:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting the user.",
      });
    }
  };


