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

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [claimedDonations, setClaimedDonations] = useState(0);
  const [pickedDonations, setPickedDonations] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullName, setFullName] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    localStorage.clear();
  };

  useEffect(() => {
    const storedName = localStorage.getItem("fullName");
    if (storedName) setFullName(storedName);

    const fetchDashboardStats = async () => {
      try {
        const [usersRes, donationsRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users"),
          fetch("http://localhost:5000/api/admin/donations"),
        ]);

        const users = await usersRes.json();
        const donations = await donationsRes.json();

        setTotalUsers(users.length);

        setClaimedDonations(donations.filter(d => d.status === "claimed").length);
        setPickedDonations(donations.filter(d => d.status === "picked").length);

        const totalResponseTime = donations.reduce((sum, d) => {
          if (d.responseTime) return sum + d.responseTime;
          return sum;
        }, 0);
        const avgResponse = totalResponseTime / (donations.length || 1);
        setResponseTime(avgResponse.toFixed(2));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboardStats();
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
            <h1 className="text-xl font-bold text-blue-600">DonationHub Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/admin/notifications">
              <button className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none">
                <BellIcon className="h-6 w-6 text-gray-700" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
              </button>
            </Link>
            <Link to="/admin/profile">
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
        <main className="flex-1 flex flex-col flex-wrap pt-12 px-4 gap-4">
          <h1 className="text-3xl font-bold mb-2">Welcome Admin, {fullName} 👋</h1>
          <p className="text-gray-600 mb-6">
            Here's an overview of platform activity.
          </p>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-3xl">{totalUsers}</p>
              <p className="text-green-600 text-sm">Live count</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold">Claimed Donations</h2>
              <p className="text-3xl">{claimedDonations}</p>
              <p className="text-green-600 text-sm">Being processed</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold">Picked Donations</h2>
              <p className="text-3xl">{pickedDonations}</p>
              <p className="text-green-600 text-sm">Completed</p>
            </div>
          </div>

         

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <Link
              to="/admin/active-users"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Active Users
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
