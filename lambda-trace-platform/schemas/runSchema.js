const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FunctionSchema = new Schema(
  {
    arn: { type: String, required: true },
    numberOfInvocation: Number,
    enableParallel: Boolean,
    strategy: String,
    powerConfiguration: [Number],
    payload: String,
    userId: String,
    isActive: Boolean
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Function", FunctionSchema);
