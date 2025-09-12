import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <main className="dashboard">
      <h1 className="dashboard__title">Dashboard</h1>
      <p className="dashboard__intro">
        Welcome! Your saved recipes and recent activity will appear here.
      </p>
    </main>
  );
};

export default Dashboard;
