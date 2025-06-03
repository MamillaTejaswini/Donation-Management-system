
import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  History,
  User,
} from "lucide-react";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white shadow-lg p-6 w-64 top-12 transition-transform duration-300 ease-in-out z-30
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <nav className="flex flex-col space-y-4 mt-4">
        <Link to="/donor/dashboard" className="flex items-center text-lg font-medium hover:text-blue-600">
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </Link>
        <Link to="/donor/new-donation" className="flex items-center text-lg font-medium hover:text-blue-600">
          <PlusCircle className="w-5 h-5 mr-3" />
          New Donation
        </Link>
        <Link to="/donor/my-donations" className="flex items-center text-lg font-medium hover:text-blue-600">
          <Package className="w-5 h-5 mr-3" />
          My Donations
        </Link>
        <Link to="/donor/history" className="flex items-center text-lg font-medium hover:text-blue-600">
          <History className="w-5 h-5 mr-3" />
          History
        </Link>
        <Link to="/donor/profile" className="flex items-center text-lg font-medium hover:text-blue-600">
          <User className="w-5 h-5 mr-3" />
          Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;


