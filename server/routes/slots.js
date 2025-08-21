const express = require("express");
const Slot = require("../models/Slot");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/slots - Get available slots
router.get("/slots", authenticateToken, async (req, res) => {
  try {
    const { from, to } = req.query;

    // Validate date parameters
    if (!from || !to) {
      return res.status(400).json({
        error:
          'Both "from" and "to" date parameters are required (YYYY-MM-DD format)',
      });
    }

    // Parse dates
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({
        error: "Invalid date format. Use YYYY-MM-DD format",
      });
    }

    // Set time boundaries (9:00 AM to 5:00 PM)
    fromDate.setHours(9, 0, 0, 0);
    toDate.setHours(17, 0, 0, 0);

    // Generate 30-minute slots for the date range
    const slots = [];
    const currentDate = new Date(fromDate);

    while (currentDate < toDate) {
      const slotStart = new Date(currentDate);
      const slotEnd = new Date(currentDate.getTime() + 30 * 60 * 1000); // 30 minutes

      // Only add slots between 9:00 AM and 5:00 PM
      if (slotStart.getHours() >= 9 && slotEnd.getHours() <= 17) {
        slots.push({
          startAt: slotStart,
          endAt: slotEnd,
        });
      }

      currentDate.setTime(currentDate.getTime() + 30 * 60 * 1000); // Move to next 30-min slot
    }

    // Check which slots are already booked
    const bookedSlots = await Slot.find({
      startAt: { $gte: fromDate, $lt: toDate },
      isBooked: true,
    }).select("startAt endAt");

    // Mark slots as booked if they exist in the database
    const availableSlots = slots.map((slot) => {
      const isBooked = bookedSlots.some(
        (bookedSlot) => bookedSlot.startAt.getTime() === slot.startAt.getTime()
      );

      return {
        id: isBooked ? null : `slot_${slot.startAt.getTime()}`,
        startAt: slot.startAt,
        endAt: slot.endAt,
        isBooked: isBooked,
        timeString: slot.startAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    });

    // Filter to show only available slots (next 7 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysFromNow = new Date(
      today.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    const filteredSlots = availableSlots.filter(
      (slot) => slot.startAt >= today && slot.startAt <= sevenDaysFromNow
    );

    res.json({
      slots: filteredSlots,
      total: filteredSlots.length,
      available: filteredSlots.filter((slot) => !slot.isBooked).length,
      booked: filteredSlots.filter((slot) => slot.isBooked).length,
    });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({
      error: "Failed to fetch available slots",
    });
  }
});

module.exports = router;
