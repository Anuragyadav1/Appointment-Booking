const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: [true, "Slot ID is required"],
      unique: true, // Prevent double booking
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ slotId: 1 });
bookingSchema.index({ status: 1 });

// Populate user and slot details when querying
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "name email role",
  }).populate({
    path: "slotId",
    select: "startAt endAt",
  });
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
