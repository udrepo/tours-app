const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = id => jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);


  res.status(200).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async(req, res, next) => {
  const { email, password } = req.body;

  //is email exists
  if (!email || !password) {
   return next(new AppError("Please provide email || password"), 400);
  }
  //if user exists and password is correct
   const user = await User.findOne({email}).select('+password');
 

   if(!user || !(await user.correctPassword(password, user.password))) {
       return next(new AppError("Wrong password || email"), 401);
   }


  //everyting ok send token
  const token = signToken(user._id);
  res.status(200).json({
      status: 'success',
      token: token
  });
});
