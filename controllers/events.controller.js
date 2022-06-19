const Event = require("../models/events.model");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

// Create Event -- Admin
exports.createEvent = catchAsyncErrors(async (req, res, next) => {
  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    event,
  });
});

// Get All Events
exports.getAllevents = catchAsyncErrors(async (req, res, next) => {
  // const resultPerPage = 8;
  // const eventsCount = await Event.countDocuments();

  // const apiFeature = new ApiFeatures(Event.find(), req.query).search().filter();

  // let events = await apiFeature.query;

  // let filteredEventsCount = events.length;

  // apiFeature.pagination(resultPerPage);

  // events = await apiFeature.query;

  // res.status(200).json({
  //   success: true,
  //   events,
  //   eventsCount,
  //   resultPerPage,
  //   filteredEventsCount,
  // });
  const count = await Event.find().countDocuments();
  const response = await Event.find().sort({ updatedAt: -1 });
  return res.status(200).json({ response: response, count });
});

// Update Event -- Admin
exports.updateEvent = catchAsyncErrors(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorHander("Event not found", 404));
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    event,
  });
});

// Delete Event -- Admin
exports.deleteEvent = catchAsyncErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorHander("Event not found", 404));
  }

  await event.remove();

  res.status(200).json({
    success: true,
    message: "Event Delete Successfully",
  });
});
