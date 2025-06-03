// src/components/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome</h1>
      <p className="homepage-subtitle">Please select how you'd like to login</p>

      <div className="role-cards">
        {[
          {
            role: "Donor",
            icon: "🤝",
            description: "Login to manage your donations and see your impact",
            route: "/login/donor",
          },
          {
            role: "Admin",
            icon: "🛠️",
            description: "Login to access administrative tools and reports",
            route: "/login/admin",
          },
          {
            role: "Volunteer",
            icon: "🙋‍♂️",
            description:
              "Login to view schedules and manage your volunteer activities",
            route: "/login/volunteer",
          },
        ].map(({ role, icon, description, route }) => (
          <div
            key={role}
            className="role-card"
            onClick={() => navigate(route)}
          >
            <div className="role-icon">{icon}</div>
            <div className="role-title">{role}</div>
            <div className="role-description">{description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
