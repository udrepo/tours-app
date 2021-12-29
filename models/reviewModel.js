const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      minLength: [5, "A review text must be less than 6 characters"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please rate tour"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review should belong to user"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review should belong to tour"],
    },
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);


reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: 'name photo'
    });
    next();
  });


const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
