const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Slot = require("./models/Slot");
const Booking = require("./models/Booking");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/appointment-booking";

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Slot.deleteMany({});
    await Booking.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user (set plain password; model will hash on save)
    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: "Passw0rd!",
      role: "admin",
    });
    await adminUser.save();
    console.log("Created admin user: admin@example.com / Passw0rd!");

    // Create sample patient user (plain password; model will hash on save)
    const patientUser = new User({
      name: "John Doe",
      email: "patient@example.com",
      password: "Passw0rd!",
      role: "patient",
    });
    await patientUser.save();
    console.log("Created patient user: patient@example.com / Passw0rd!");

    // Create some sample slots for the next 7 days
    const slots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);

      // Generate slots from 9:00 AM to 5:00 PM (30-minute intervals)
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = new Date(currentDate);
          slotStart.setHours(hour, minute, 0, 0);

          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + 30);

          // Only create slots for future dates
          if (slotStart > new Date()) {
            slots.push({
              startAt: slotStart,
              endAt: slotEnd,
              isBooked: false,
            });
          }
        }
      }
    }

    let insertedSlots = [];
    if (slots.length > 0) {
      insertedSlots = await Slot.insertMany(slots);
      console.log(`Created ${insertedSlots.length} available slots`);
    }

    // Create a sample booking for the patient
    if (insertedSlots.length > 0) {
      const sampleSlotDoc = insertedSlots[0];
      const sampleBooking = new Booking({
        userId: patientUser._id,
        slotId: sampleSlotDoc._id,
      });
      await sampleBooking.save();

      // Mark the slot as booked
      await Slot.findByIdAndUpdate(sampleSlotDoc._id, { isBooked: true });
      console.log("Created sample booking for patient");
    }

    console.log("\n✅ Database seeded successfully!");
    console.log("\nDefault users:");
    console.log("Admin: admin@example.com / Passw0rd!");
    console.log("Patient: patient@example.com / Passw0rd!");
    console.log("\nYou can now start the server and test the application.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seeding function
seedDatabase();
