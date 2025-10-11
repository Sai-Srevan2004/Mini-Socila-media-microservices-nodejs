const logger = require('../utils/logger');
const { validateRegistration, validatelogin } = require('../utils/SchemaValidation');
const User = require('../models/User');
const generateTokens = require('../utils/generateTokens');
const RefreshToken = require('../models/RefreshToken');

// ----------------- REGISTER -----------------
const register = async (req, res) => {
  logger.info("Registration endpoint hit...");

  try {
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Request body missing!" });
    }
    const { username, email, password } = req.body;

    // Validate input
    const { error } = validateRegistration({ username, email, password });
    if (error) {
      logger.warn("Validation error during registration:", error.message);
      return res.status(400).json({ success: false, message: error.message });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      logger.warn("User already exists with this email or username!");
      return res.status(400).json({ success: false, message: "User already exists with this email or username!" });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    logger.info("User registered successfully:", user._id);
    return res.status(201).json({ success: true, message: "Registration successful!" });

  } catch (error) {
    logger.error("Error in registration:", error);
    return res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

// ----------------- LOGIN -----------------
const login = async (req, res) => {
  logger.info("Login endpoint hit...");

  try {
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Request body missing!" });
    }
    
    const { email, password } = req.body;
    // Validate input
    const { error } = validatelogin({ email, password });
    if (error) {
      logger.warn("Validation error during login:", error.message);
      return res.status(400).json({ success: false, message: error.message });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("User does not exist with this email!");
      return res.status(400).json({ success: false, message: "User does not exist. Please register first!" });
    }

    // Compare password
    const passMatch = await user.comparePassword(password);
    if (!passMatch) {
      logger.warn("Incorrect password!");
      return res.status(401).json({ success: false, message: "Incorrect password!" });
    }

    // Delete any old refresh tokens for this user
    await RefreshToken.deleteMany({ user: user._id });

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    logger.info("Login successful for user:", user._id);
    return res.status(200).json({ success: true, message: "Login successful!", accessToken });

  } catch (error) {
    logger.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

// ----------------- REFRESH TOKEN -----------------
const refreshToken = async (req, res) => {
  logger.info("Refresh token endpoint hit...");

  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) {
      logger.warn("Refresh token missing!");
      return res.status(400).json({ success: false, message: "Refresh token missing!" });
    }

    const refToken = await RefreshToken.findOne({ token: refreshTokenCookie });
    if (!refToken) {
      logger.warn("Token not found in DB!");
      return res.status(404).json({ success: false, message: "Token not found in DB!" });
    }

    // Check expiration
    if (refToken.expiresAt < new Date()) {
      await refToken.deleteOne({_id:refToken._id});
      logger.warn("Refresh token expired!");
      return res.status(403).json({ success: false, message: "Refresh token expired!" });
    }

    // Check if user still exists
    const user = await User.findById(refToken.user);
    if (!user) {
      logger.warn("User not found!");
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    // Remove old tokens and generate new ones
    await RefreshToken.deleteMany({ user: user._id });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(user);

    // Clear and reset cookie
    res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "none" });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    logger.info("New tokens generated for user:", user._id);
    return res.status(200).json({ success: true, message: "New tokens generated!", accessToken: newAccessToken });

  } catch (error) {
    logger.error("Error in refresh token endpoint:", error);
    return res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

module.exports = { register, login, refreshToken };
