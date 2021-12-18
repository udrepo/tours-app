const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter a tour name"],
      unique: true,
      trim: true,
      maxLength: [40, "A tour name must be less or equal then 40 characters"],
      minLength: [6, "A tour name must be more than 6 characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "Specify a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Specify a maximum group size"],
    },
    difficulty: {
      type: String,
      required: [true, "Specify a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Not correct difficulty level",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Enter a price"],
    },
    discount: {
      type: Number,
      message: "",
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount should be less or equal to price",
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Enter a description"],
    },
    imageCover: {
      type: String,
      required: [true, "Enter a image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDate: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//Document Middleware: runs before .save() and create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({
    secretTour: { $ne: true },
  });
  next();
});

//Aggregation Middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
