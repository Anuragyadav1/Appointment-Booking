import React, { useEffect, useState } from "react";
import { bookingsAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { format } from "date-fns";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await bookingsAPI.getMyBookings();
        setBookings(res.data.bookings || []);
      } catch (e) {
        toast.error(e.response?.data?.error || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your bookings..." />;

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">My Bookings</h1>
        </div>
        {bookings.length === 0 ? (
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            No bookings yet.
          </div>
        ) : (
          <div className="grid grid-cols-1" style={{ gap: "1rem" }}>
            {bookings.map((b) => (
              <div
                key={b.id}
                className="card"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {format(new Date(b.startAt), "EEEE, MMM d, yyyy")}
                    </div>
                    <div style={{ color: "#6b7280" }}>
                      {format(new Date(b.startAt), "h:mm a")} -{" "}
                      {format(new Date(b.endAt), "h:mm a")}
                    </div>
                  </div>
                  <div>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
