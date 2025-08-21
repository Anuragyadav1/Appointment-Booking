import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { slotsAPI, bookingsAPI } from "../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ensure we have valid dates for initialization
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const weekFromToday = addDays(today, 6);
  const weekFromTodayStr = format(weekFromToday, "yyyy-MM-dd");

  const [dateRange, setDateRange] = useState({
    from: todayStr,
    to: weekFromTodayStr,
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Initial date range:", dateRange); // Debug log
    // Only fetch slots if both dates are valid
    if (dateRange.from && dateRange.to && dateRange.from <= dateRange.to) {
      fetchSlots();
    }
  }, [dateRange]);

  const fetchSlots = async () => {
    // Validate date range before making API call
    if (!dateRange.from || !dateRange.to) {
      console.log("Invalid date range:", dateRange); // Debug log
      toast.error("Please select both start and end dates");
      return;
    }

    if (dateRange.from > dateRange.to) {
      console.log("Start date after end date:", dateRange); // Debug log
      toast.error("Start date must be before or equal to end date");
      return;
    }

    console.log("Fetching slots with date range:", dateRange); // Debug log
    setLoading(true);
    try {
      const response = await slotsAPI.getSlots(dateRange.from, dateRange.to);
      setSlots(response.data.slots || []);
    } catch (error) {
      toast.error("Failed to fetch available slots");
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
  };

  const handleBookSlot = async () => {
    if (!selectedSlot) return;

    setLoading(true);
    try {
      await bookingsAPI.bookSlot({
        startAt: selectedSlot.startAt,
        endAt: selectedSlot.endAt,
      });

      toast.success("Slot booked successfully!");
      setSelectedSlot(null);
      fetchSlots(); // Refresh slots
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to book slot";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    console.log(`Date change - ${name}:`, value); // Debug log
    setDateRange((prev) => {
      const newRange = { ...prev, [name]: value };
      console.log("New date range:", newRange); // Debug log
      return newRange;
    });
  };

  const groupSlotsByDate = (slots) => {
    const grouped = {};
    slots.forEach((slot) => {
      const date = format(new Date(slot.startAt), "yyyy-MM-dd");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByDate(slots);

  if (loading && slots.length === 0) {
    return <LoadingSpinner message="Loading available slots..." />;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Book Your Appointment</h1>
          <p style={{ margin: 0, color: "#6b7280" }}>
            Select an available time slot for your appointment
          </p>
        </div>

        {/* Date Range Selector */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="grid grid-cols-2" style={{ gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">From Date</label>
              <input
                type="date"
                name="from"
                value={dateRange.from || ""}
                onChange={handleDateChange}
                className="form-input"
                min={format(new Date(), "yyyy-MM-dd")}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">To Date</label>
              <input
                type="date"
                name="to"
                value={dateRange.to || ""}
                onChange={handleDateChange}
                className="form-input"
                min={dateRange.from || format(new Date(), "yyyy-MM-dd")}
                required
              />
            </div>
          </div>
          {/* Debug info - remove in production */}
          <div
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              marginTop: "0.5rem",
            }}
          >
            Debug: From: {dateRange.from || "undefined"}, To:{" "}
            {dateRange.to || "undefined"}
          </div>
        </div>

        {/* Available Slots */}
        {Object.keys(groupedSlots).length > 0 ? (
          Object.entries(groupedSlots).map(([date, dateSlots]) => (
            <div key={date} style={{ marginBottom: "2rem" }}>
              <h3 style={{ marginBottom: "1rem", color: "#374151" }}>
                {format(new Date(date), "EEEE, MMMM d, yyyy")}
              </h3>
              <div className="slots-grid">
                {dateSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`slot-item ${slot.isBooked ? "booked" : ""} ${
                      selectedSlot && selectedSlot.startAt === slot.startAt
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    <div className="slot-time">{slot.timeString}</div>
                    <div className="slot-date">
                      {slot.isBooked ? "Booked" : "Available"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
          >
            <p>No available slots found for the selected date range.</p>
            <p>Please try a different date range or check back later.</p>
          </div>
        )}

        {/* Booking Confirmation */}
        {selectedSlot && (
          <div
            className="card"
            style={{
              backgroundColor: "#f0f9ff",
              border: "2px solid #3b82f6",
            }}
          >
            <div className="card-header">
              <h3 style={{ color: "#1e40af", margin: 0 }}>
                Confirm Your Booking
              </h3>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <p>
                <strong>Date:</strong>{" "}
                {format(new Date(selectedSlot.startAt), "EEEE, MMMM d, yyyy")}
              </p>
              <p>
                <strong>Time:</strong> {selectedSlot.timeString}
              </p>
              <p>
                <strong>Duration:</strong> 30 minutes
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={handleBookSlot}
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
              <button
                onClick={() => setSelectedSlot(null)}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card" style={{ marginTop: "2rem" }}>
          <div className="card-header">
            <h3 style={{ margin: 0 }}>Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2" style={{ gap: "1rem" }}>
            <button
              onClick={() => navigate("/patient/bookings")}
              className="btn btn-primary"
            >
              View My Bookings
            </button>
            <button
              onClick={fetchSlots}
              className="btn btn-secondary"
              disabled={loading}
            >
              Refresh Slots
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
