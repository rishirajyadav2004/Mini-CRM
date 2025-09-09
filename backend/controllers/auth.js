const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const generateToken = require('../utils/jwt');
const { registerValidation, loginValidation } = require('../middleware/validation');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    // Validate data
    const { error } = registerValidation(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('User already exists', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    // Validate data
    const { error } = loginValidation(req.body);
    if (error) {
      return next(new ErrorResponse(error.details[0].message, 400));
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id);

const options = {
  expires: new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  ),
  httpOnly: true
};

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};