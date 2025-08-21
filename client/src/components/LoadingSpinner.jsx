import React from "react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading">
      <div>
        <div className="spinner"></div>
        <p style={{ marginTop: "1rem", textAlign: "center" }}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
