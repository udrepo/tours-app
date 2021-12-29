const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) return next(new AppError("Document not found", 404));
    res.status(204).json({
      status: "success",
      result: document,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidtors: true,
    });

    if (!document) return next(new AppError("Document not found", 404));
    res.status(200).json({
      status: "success",
      result: document,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: document,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) {
      query = query.populate(popOptions);
    }

    const document = await query;

    if (!document) return next(new AppError("document not found", 404));

    res.status(200).json({
      status: "success",
      data: document,
    });
  });

  exports.getAll = Model => catchAsync(async (req, res, next) => {
     // To allow for nested GET reviews on tour (hack)
     let filter = {};
     if (req.params.tourId) filter = { tour: req.params.tourId };
    
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
      
    const document = await features.query;
  
    res.send({
      status: "success",
      results: document.length,
      data: {
        document
      },
    });
  });