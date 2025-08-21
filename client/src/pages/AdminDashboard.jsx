import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { bookingsAPI } from "../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
  });

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, filters.status]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getAllBookings(
        pagination.page,
        pagination.limit,
        filters.status
      );

      setBookings(response.data.bookings || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
      }));
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const getStatusBadge = (status) => {
    return <span className={`status-badge status-${status}`}>{status}</span>;
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      await bookingsAPI.updateStatus(bookingId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      // Update in place for snappy UI
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (e) {
      toast.error(e.response?.data?.error || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && bookings.length === 0) {
    return <LoadingSpinner message="Loading bookings..." />;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Admin Dashboard</h1>
          <p style={{ margin: 0, color: "#6b7280" }}>
            Manage all appointments and bookings
          </p>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="grid grid-cols-3" style={{ gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Status Filter</label>
              <select
                value={filters.status}
                onChange={handleStatusFilter}
                className="form-input"
              >
                <option value="">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Total Bookings</label>
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                }}
              >
                {pagination.total}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Current Page</label>
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                }}
              >
                {pagination.page} of {pagination.pages}
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {bookings.length > 0 ? (
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0 }}>All Bookings</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f9fafb" }}>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Patient
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Date & Time
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Booked On
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        textAlign: "left",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                    >
                      <td style={{ padding: "0.75rem" }}>
                        <div>
                          <div style={{ fontWeight: "600" }}>
                            {booking.user.name}
                          </div>
                          <div
                            style={{ fontSize: "0.875rem", color: "#6b7280" }}
                          >
                            {booking.user.email}
                          </div>
                          <div
                            style={{ fontSize: "0.75rem", color: "#9ca3af" }}
                          >
                            {booking.user.role}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <div>
                          <div style={{ fontWeight: "600" }}>
                            {format(
                              new Date(booking.slot.startAt),
                              "MMM d, yyyy"
                            )}
                          </div>
                          <div
                            style={{ fontSize: "0.875rem", color: "#6b7280" }}
                          >
                            {format(new Date(booking.slot.startAt), "h:mm a")} -{" "}
                            {format(new Date(booking.slot.endAt), "h:mm a")}
                          </div>
                          <div
                            style={{ fontSize: "0.75rem", color: "#9ca3af" }}
                          >
                            {format(new Date(booking.slot.startAt), "EEEE")}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        {getStatusBadge(booking.status)}
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          {format(new Date(booking.createdAt), "MMM d, yyyy")}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                          {format(new Date(booking.createdAt), "h:mm a")}
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            className="btn btn-secondary"
                            disabled={
                              updatingId === booking.id ||
                              booking.status === "confirmed"
                            }
                            onClick={() =>
                              updateStatus(booking.id, "confirmed")
                            }
                          >
                            Confirm
                          </button>
                          <button
                            className="btn btn-danger"
                            disabled={
                              updatingId === booking.id ||
                              booking.status === "cancelled"
                            }
                            onClick={() =>
                              updateStatus(booking.id, "cancelled")
                            }
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-success"
                            disabled={
                              updatingId === booking.id ||
                              booking.status === "completed"
                            }
                            onClick={() =>
                              updateStatus(booking.id, "completed")
                            }
                          >
                            Complete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
          >
            <p>No bookings found.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                className="btn btn-secondary"
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`btn ${
                      pagination.page === pageNum
                        ? "btn-primary"
                        : "btn-secondary"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                className="btn btn-secondary"
                disabled={pagination.page === pagination.pages}
              >
                Next
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
              onClick={fetchBookings}
              className="btn btn-secondary"
              disabled={loading}
            >
              Refresh Bookings
            </button>
            <button
              onClick={() => (window.location.href = "/admin/bookings")}
              className="btn btn-primary"
            >
              View All Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
