const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

const signToken = (id) =>
  jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 100
    ),
    secure: true,
    httpOnly: true,
  }; 

  if (process.env.NODE_ENV !== "production") cookieOptions.secure = false;

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).send({ status: "success", token });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    //role: req.body.role,
  });
  await new Email(newUser, '').sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //is email exists
  if (!email || !password) {
    return next(new AppError("Please provide email || password"), 400);
  }
  //if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Wrong password || email"), 401);
  }

  //everyting ok send token
  createSendToken(user, 201, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  //geting token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access."),
      401
    );
  }

  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // user still exists?
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("User does not exist anymore!", 401));
  }

  //check if user changed password
  if (freshUser.changedPassword(decoded.iat)) {
    return next(new AppError("User changed password", 401));
  }

  //Access granted!
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission"), 403);
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError("There is no user with email " + req.body.email),
      401
    );
  }

  //generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to user email 
  try {
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
  
    await new Email(user, resetUrl).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent email successfully",
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending email. Please try again later"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  //if token is ok, set new password
  if (!user) {
    return next(new AppError("Invalid token"), 400);
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //update changedPassword at

  //log the user in
  createSendToken(user, 201, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //get user from db
  const user = await User.findById(req.user.id).select("+password");

  //check if entered password is correct

  if (!(await user.correctPassword(req.body.current, user.password))) {
    return next(new AppError("Wrong password"), 401);
  }

  //update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.password;
  await user.save();

  //log in user
  createSendToken(user, 201, res);
});
