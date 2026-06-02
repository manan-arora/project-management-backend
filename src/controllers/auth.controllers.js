import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import jwt from "jsonwebtoken";

// Generate JWT access & refresh tokens and store refresh token in DB
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token for future validation
    user.refreshToken = refreshToken;

    // Skip validations since only refreshToken is being updated
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access/refresh tokens",
    );
  }
};

// Register a new user and send email verification link
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  // Check if email or username already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists", []);
  }

  // Create user (password gets hashed via mongoose middleware)
  const user = await User.create({
    email,
    username,
    password,
    isEmailVerified: false,
  });

  // Generate temporary token for email verification
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  // Store hashed token and expiry in DB
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  // Send verification email containing unhashed token
  await sendEmail({
    email: user?.email,
    subject: "Verfiy your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  // Fetch user again excluding sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  // Return sanitized user data
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully and verification email has been sent on your email",
      ),
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
      }),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw new ApiError(400, "Email Verification token is missing");
  }

  let hashedToken = crypto
    .createHash(sha256)
    .update(verificationToken)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() }, // check if expiry is greater than current time => token not expired
  });

  if (!user) {
    throw new ApiError(400, "Token is invalid or expired");
  }

  //since email is now verified, clean up token and expiry from db
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  user.isEmailVerified = true;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isEmailVerified: true,
      },
      "Email is verified",
    ),
  );
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (user.isEmailVerified) {
    throw new ApiError(402, "Email already verified");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  // Store hashed token and expiry in DB
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  // Send verification email containing unhashed token
  await sendEmail({
    email: user?.email,
    subject: "Verfiy your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Mail has been sent to your email"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get refresh token from cookie (browser) or request body (mobile/Postman)
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // Cannot issue new tokens without a refresh token
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    // Verify token signature and expiry
    // If verified, store the payload in decodedToken
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    // Get the user associated with this refresh token
    const user = await User.findById(decodedToken?._id);

    // Reject if user no longer exists
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Accept only the latest refresh token stored in DB
    // (prevents reuse of old/stolen refresh tokens)
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired");
    }

    // Secure cookie settings
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Generate fresh access & refresh tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    // Store newly generated refresh token in DB
    // so older refresh tokens become invalid
    user.refreshToken = newRefreshToken;
    await user.save();

    // Send new tokens in cookies and response body
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    // Covers invalid, tampered, or expired refresh tokens
    throw new ApiError(401, "Invalid refresh token");
  }
});

// const getCurrentUser = asyncHandler(async (req, res) => {
// })

export { registerUser, login, logoutUser, getCurrentUser, verifyEmail, resendEmailVerification, refreshAccessToken };
