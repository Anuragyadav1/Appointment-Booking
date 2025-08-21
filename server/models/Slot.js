const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    startAt: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endAt: {
      type: Date,
      required: [true, "End time is required"],
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
slotSchema.index({ startAt: 1, endAt: 1 });
slotSchema.index({ isBooked: 1 });

// Virtual for slot duration in minutes
slotSchema.virtual("durationMinutes").get(function () {
  return (this.endAt - this.startAt) / (1000 * 60);
});

// Ensure end time is after start time
slotSchema.pre("save", function (next) {
  if (this.endAt <= this.startAt) {
    return next(new Error("End time must be after start time"));
  }
  next();
});

module.exports = mongoose.model("Slot", slotSchema);
