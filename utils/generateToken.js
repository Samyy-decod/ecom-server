const generateToken = (user, statusCode, message, res) => {
  // Generate JWT Token
  const token = user.getJwtToken();
  console.log("token",token)
  
  // Cookie options
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),  // Cookie expiry
    secure: process.env.NODE_ENV === 'production',  // Secure cookies in production
  };

  // Set cookie and return response
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    message: message,
    user,
    token,
  });
};

module.exports = generateToken;
