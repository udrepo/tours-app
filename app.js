const ex = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");
const app = ex();

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

//middlewares
//set security http
app.use(helmet());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
//body parser. reading data from from body
app.use(ex.json({ limit: "100kb" }));

//data sanitation against NOSQL injection
app.use(mongoSanitize());

//data sanitation against xss
app.use(xss());

//prevent parametr pollution
app.use(
  hpp({
    whiteList: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//limit requests
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this API",
});
app.use("/api", limiter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) =>
  next(new AppError("API address not found", 404))
);

app.use(errorHandler);

module.exports = app;
