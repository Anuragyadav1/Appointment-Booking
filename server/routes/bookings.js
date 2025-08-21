const express = require("express");
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = express.Router();

// Apply authentication to all booking routes
router.use(authenticateToken);

// POST /api/book - Book a slot
router.post("/book", async (req, res) => {
  try {
    const { slotId, startAt, endAt } = req.body;
    const userId = req.user._id;

    // Validation
    if (!startAt || !endAt) {
      return res.status(400).json({
        error: "Start time and end time are required",
      });
    }

    const startTime = new Date(startAt);
    const endTime = new Date(endAt);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({
        error: "Invalid date format",
      });
    }

    // Check if slot is in the future
    if (startTime <= new Date()) {
      return res.status(400).json({
        error: "Cannot book slots in the past",
      });
    }

    // Check if slot is within business hours (9:00 AM - 5:00 PM)
    const startHour = startTime.getHours();
    const endHour = endTime.getHours();

    if (startHour < 9 || endHour > 17) {
      return res.status(400).json({
        error: "Slots must be between 9:00 AM and 5:00 PM",
      });
    }

    // Check if slot duration is exactly 30 minutes
    const duration = (endTime - startTime) / (1000 * 60);
    if (duration !== 30) {
      return res.status(400).json({
        error: "Slot duration must be exactly 30 minutes",
      });
    }

    // Check if slot is already booked
    const existingBooking = await Booking.findOne({
      "slotId.startAt": startTime,
      "slotId.endAt": endTime,
    }).populate("slotId");

    if (existingBooking) {
      return res.status(409).json({
        error: "This slot is already booked",
      });
    }

    // Create or find the slot
    let slot = await Slot.findOne({
      startAt: startTime,
      endAt: endTime,
    });

    if (!slot) {
      slot = new Slot({
        startAt: startTime,
        endAt: endTime,
        isBooked: true,
      });
      await slot.save();
    } else if (slot.isBooked) {
      return res.status(409).json({
        error: "This slot is already booked",
      });
    } else {
      slot.isBooked = true;
      await slot.save();
    }

    // Create the booking
    const booking = new Booking({
      userId,
      slotId: slot._id,
    });

    await booking.save();

    // Populate the booking details
    await booking.populate([
      { path: "userId", select: "name email role" },
      { path: "slotId", select: "startAt endAt" },
    ]);

    res.status(201).json({
      message: "Slot booked successfully",
      booking: {
        id: booking._id,
        userId: booking.userId,
        slotId: booking.slotId,
        status: booking.status,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      error: "Failed to book slot. Please try again.",
    });
  }
});

// GET /api/my-bookings - Get user's bookings
router.get("/my-bookings", async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userId })
      .populate("slotId")
      .sort({ "slotId.startAt": 1 });

    const formattedBookings = bookings.map((booking) => ({
      id: booking._id,
      startAt: booking.slotId.startAt,
      endAt: booking.slotId.endAt,
      status: booking.status,
      createdAt: booking.createdAt,
      timeString: booking.slotId.startAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      dateString: booking.slotId.startAt.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    res.json({
      bookings: formattedBookings,
      total: formattedBookings.length,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      error: "Failed to fetch your bookings",
    });
  }
});

// GET /api/all-bookings - Get all bookings (admin only)
router.get("/all-bookings", requireRole(["admin"]), async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status && ["confirmed", "cancelled", "completed"].includes(status)) {
      query.status = status;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { "slotId.startAt": -1 },
    };

    const bookings = await Booking.find(query)
      .populate("userId", "name email role")
      .populate("slotId")
      .sort({ "slotId.startAt": -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    const formattedBookings = bookings.map((booking) => ({
      id: booking._id,
      user: {
        id: booking.userId._id,
        name: booking.userId.name,
        email: booking.userId.email,
        role: booking.userId.role,
      },
      slot: {
        startAt: booking.slotId.startAt,
        endAt: booking.slotId.endAt,
        timeString: booking.slotId.startAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        dateString: booking.slotId.startAt.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
      status: booking.status,
      createdAt: booking.createdAt,
    }));

    res.json({
      bookings: formattedBookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({
      error: "Failed to fetch all bookings",
    });
  }
});

// PATCH /api/bookings/:id/status - Update booking status (admin only)
router.patch(
  "/bookings/:id/status",
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const allowedStatuses = ["confirmed", "cancelled", "completed"];
      if (!allowedStatuses.includes(status)) {
        return res
          .status(400)
          .json({
            error: "Invalid status. Allowed: confirmed, cancelled, completed",
          });
      }

      const booking = await Booking.findById(id)
        .populate("slotId")
        .populate("userId");
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      booking.status = status;
      await booking.save();

      if (status === "cancelled" && booking.slotId) {
        await Slot.findByIdAndUpdate(booking.slotId._id, { isBooked: false });
      }

      return res.json({
        message: "Booking status updated",
        booking: {
          id: booking._id,
          status: booking.status,
          user: {
            id: booking.userId?._id,
            name: booking.userId?.name,
            email: booking.userId?.email,
          },
          slot: booking.slotId
            ? { startAt: booking.slotId.startAt, endAt: booking.slotId.endAt }
            : null,
          updatedAt: booking.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      return res.status(500).json({ error: "Failed to update booking status" });
    }
  }
);

module.exports = router;
