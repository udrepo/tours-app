const ex = require("express");
const morgan = require("morgan");

const AppError = require('./utils/appError')
const errorHandler = require('./controllers/errorController')
const app = ex();

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(ex.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => next(new AppError('API address not found', 404)));

app.use(errorHandler);

module.exports = app;
