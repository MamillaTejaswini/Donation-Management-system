import React, { useState, useEffect } from "react";
import Sidebar from "./sideBar";
import {
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const NAVBAR_HEIGHT = 48;

const VolunteerDashboard = () => {
  const [pickedDonations, setPickedDonations] = useState(0);
  const [availableDonations, setAvailableDonations] = useState(0);
  const [responseTime, setResponseTime] = useState(0); // in hours or minutes
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullName, setFullName] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    localStorage.clear();
  };

  useEffect(() => {
    const storedName = localStorage.getItem("fullName");
    if (storedName) setFullName(storedName);

    const fetchDonationStats = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await fetch(
          `http://localhost:5000/api/getDonations?email=${email}`
        );
        if (!response.ok) throw new Error("Fetch error");
        const donations = await response.json();

        setPickedDonations(donations.filter(d => d.status === "picked").length);
        setAvailableDonations(donations.filter(d => d.status === "available").length);

        // Mock response time logic (replace with real API later)
        const totalResponseTime = donations.reduce((sum, d) => {
          if (d.responseTime) return sum + d.responseTime;
          return sum;
        }, 0);
        const avgResponse = totalResponseTime / (donations.length || 1);
        setResponseTime(avgResponse.toFixed(2));
      } catch (error) {
        console.error(error);
      }
    };

    fetchDonationStats();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />

      <div
        className="flex-1 flex flex-col pt-12 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: sidebarOpen ? 256 : 0,
          paddingTop: NAVBAR_HEIGHT,
        }}
      >
        {/* Top navbar */}
        <header
          className="flex items-center justify-between bg-white shadow px-4 py-3 fixed top-0 left-0 right-0 z-40"
          style={{ height: NAVBAR_HEIGHT }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none"
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-blue-600">DonationHub</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/volunteer/notifications">
              <button className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none">
                <BellIcon className="h-6 w-6 text-gray-700" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
              </button>
            </Link>
            <Link to="/volunteer/profile">
              <button className="p-2 rounded-full hover:bg-gray-200 focus:outline-none">
                <UserCircleIcon className="h-8 w-8 text-gray-700" />
              </button>
            </Link>
            <Link to="/" onClick={handleLogout}>
              <button className="p-2 rounded-full hover:bg-gray-200 focus:outline-none">
                <PowerIcon className="h-8 w-8 text-gray-700" />
              </button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col flex-wrap pt-12 px-4 gap-4 ">
          <h1 className="text-3xl font-bold mb-2">Hello, {fullName}! 👋</h1>
          <p className="text-gray-600 mb-6">
            Here's the summary of your donations.
          </p>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold">Donations Picked Up</h2>
              <p className="text-3xl">{pickedDonations}</p>
              <p className="text-green-600 text-sm">+5% from last month</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold">Available Donations</h2>
              <p className="text-3xl">{availableDonations}</p>
              <p className="text-green-600 text-sm">Live now</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold">Avg. Response Time</h2>
              <p className="text-3xl">{responseTime} min</p>
              <p className="text-green-600 text-sm">Calculated</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <Link
              to="/volunteer/available-donations"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
            >
              View Available
            </Link>
            <Link
              to="/volunteer/history"
              className="border px-4 py-2 rounded hover:bg-gray-100"
            >
              View History
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
