// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AuthPage from "./AuthPage";
import Dashboard from "./Donor/DashBoard/Dashboard";
import VolunteerDashboard from "./volunteer/VolunteerDashBoard";

import MyDonations from "./Donor/DashBoard/MyDonations";
import HistoryPage from "./Donor/DashBoard/HistoryPage";
import Profile from "./Profile";
import NewDonation from "./Donor/DashBoard/NewDonation";
import AvailableDonations from "./volunteer/AvailableDonations";
import PickupHistory from "./volunteer/VolunteerHistory";
import AdminDashboard from "./Admin/AdminDashboard";
import AllDonations from "./Admin/ViewDonations";
import UserManagement from "./Admin/ViewUsers";
import ActiveUserManagement from "./Admin/ViewActiveUsers";

const App = () => {
  return (
    
      <Routes>
        <Route path="/" element={<HomePage />} />
      <Route path="/login/:role" element={<AuthPage />} />
      
       <Route path="/donor/dashboard" element={<Dashboard/>}/>
          <Route path="/donor/new-donation" element={<NewDonation />} />
          <Route path="/donor/my-donations" element={<MyDonations />} />
          <Route path="/donor/history" element={<HistoryPage />} />
          <Route path="/donor/profile" element={<Profile />} />
           <Route path="/volunteer/profile" element={<Profile />} />
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard/>}/>
         <Route path="/volunteer/available-donations" element={<AvailableDonations/>}/>
         <Route path="/volunteer/history" element={<PickupHistory/>}/>
         <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
         <Route path="/admin/Profile" element={<Profile/>}/>
         <Route path="/admin/view-donations" element={<AllDonations/>}/>
         <Route path="/admin/view-users" element={<UserManagement/>}/>
         <Route path="/admin/active-users" element={<ActiveUserManagement/>}/>
      </Routes>

  );
};

export default App;


