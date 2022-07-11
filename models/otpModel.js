const { Schema, model } = require("mongoose");

const otpSchema = Schema(
  {
    number: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 900 },
      // After 15mins it will be delate
    },
  },
  { timestamps: true }
);

module.exports = model("Otp", otpSchema);
