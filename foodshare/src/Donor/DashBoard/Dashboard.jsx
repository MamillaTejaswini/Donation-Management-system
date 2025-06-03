
import React, { useState,useEffect } from "react";
import Sidebar from "./sideBar";
import { BellIcon, UserCircleIcon, Bars3Icon, PowerIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const NAVBAR_HEIGHT = 48; // px (you can adjust if needed)


const Dashboard = ({ name }) => {
  const [totalDonations, setTotalDonations] = useState(0);
const [claimedDonations, setClaimedDonations] = useState(0);
const [pickedUpDonations, setPickedUpDonations] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullName, setFullName] = useState(""); // state for fullName

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("fullName");
  localStorage.removeItem("phone");
  localStorage.removeItem("location");
};

  useEffect(() => {
    // fetch user name and donation counts
    const storedName = localStorage.getItem("fullName");
    if (storedName) setFullName(storedName);

    async function fetchDonations() {
      try {
        const email = localStorage.getItem("email");
        const response = await fetch(`http://localhost:5000/api/getDonations?email=${email}`); // your API
        if (!response.ok) throw new Error('Fetch error');
        const donations = await response.json();
         console.log("Fetched donations:", donations); 
        setTotalDonations(donations.length);
        setClaimedDonations(donations.filter(d => d.status === 'claimed').length);
        setPickedUpDonations(donations.filter(d => d.status === 'picked').length);
      } catch (error) {
        console.error(error);
      }
    }

    fetchDonations();
  }, []);
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main area */}
      <div
        className={`flex-1 flex flex-col pt-12 transition-all duration-300 ease-in-out`}
        style={{
          marginLeft: sidebarOpen ? 256 : 0, // sidebar width in px
          paddingTop: NAVBAR_HEIGHT,
        }}
      >

        {/* Top navbar fixed */}
        <header
          className="flex items-center justify-between bg-white shadow px-4 py-3 fixed top-0 left-0 right-0 z-40"
          style={{ height: NAVBAR_HEIGHT }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-200 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-blue-600">DonationHub</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/donor/notifications" aria-label="Notifications">
              <button className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none">
                <BellIcon className="h-6 w-6 text-gray-700" />
                <span className="absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-red-600"></span>
              </button>
            </Link>
            <Link to="/donor/profile" aria-label="Profile">
              <button className="p-2 rounded-full hover:bg-gray-200 focus:outline-none">
                <UserCircleIcon className="h-8 w-8 text-gray-700" />
              </button>
            </Link>
            <Link to="/" aria-label="Logout" onClick={handleLogout}>
  <button className="p-2 rounded-full hover:bg-gray-200 focus:outline-none">
    < PowerIcon className="h-8 w-8 text-gray-700" />
  </button>
</Link>

          </div>
        </header>

        {/* Content */}
        {/* <main className="flex-1 overflow-auto bg-gray-100 p-6" > */}
        <main className="flex-1 flex flex-col flex-wrap pt-12 px-4 gap-4 ">
          <h1 className="text-3xl font-bold mb-2">Hello, {fullName}! 👋</h1>
          <p className="text-gray-600 mb-6">
            Here's what's happening with your donations today.
          </p>
          <div className="grid grid-cols-3 gap-6 mb-6">
  <div className="p-4 bg-white rounded-lg shadow">
    <h2 className="text-lg font-semibold">Total Donations</h2>
    <p className="text-3xl">{totalDonations}</p>
    <p className="text-green-600 text-sm">+15% from last month</p>
  </div>
  <div className="p-4 bg-white rounded-lg shadow">
    <h2 className="text-lg font-semibold">Donations Claimed</h2>
    <p className="text-3xl">{claimedDonations}</p>
    <p className="text-green-600 text-sm">+8% from last month</p>
  </div>
  <div className="p-4 bg-white rounded-lg shadow">
    <h2 className="text-lg font-semibold">Donations Picked Up</h2>
    <p className="text-3xl">{pickedUpDonations}</p>
    <p className="text-green-600 text-sm">+5% from last month</p>
  </div>
</div>


          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
           <Link to="/donor/new-donation" className="bg-blue-500 text-white px-4 py-2 rounded mr-2 inline-block hover:bg-blue-600">
  New Donation
</Link>
           <Link
  to="/donor/history"
  className="border px-4 py-2 rounded inline-block hover:bg-gray-100"
>
  History
</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;



