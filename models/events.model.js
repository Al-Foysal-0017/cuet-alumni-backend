const mongoose = require("mongoose");
const crypto = require("crypto");

// events schema
const eventsScheama = new mongoose.Schema(
  {
    date: {
      type: Number,
      trim: true,
      required: true,
    },
    month: {
      type: String,
      trim: true,
      required: true,
    },
    year: {
      type: Number,
      trim: true,
      required: true,
    },
    particular_date: {
      type: String,
      trim: true,
      required: true,
    },
    media: {
      type: String,
      trim: true,
      required: true,
    },
    organized_by: {
      type: String,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    desc: {
      type: String,
      trim: true,
      required: true,
    },
    img: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventsScheama);
