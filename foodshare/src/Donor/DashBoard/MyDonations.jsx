import React, { useEffect, useState } from 'react';
import { getDonations, cancelDonation } from '../../services/donationService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();



  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      loadDonations(email);
    }
  }, []);

  const loadDonations = async (email) => {
    try {
      const data = await getDonations(email);
      setDonations(data);
    } catch (err) {
      console.error("Failed to fetch donations", err);
    }
  };
const handleEdit = (donation) => {
  navigate('/donor/new-donation', { state: { donation, isEdit: true } });
};

 const handleCancel = async (id) => {
  const confirm = window.confirm("Are you sure you want to cancel this donation?");
  if (!confirm) return;

  const success = await cancelDonation(id);
  if (success) {
    alert("Donation cancelled successfully");
    // Reload or update the UI state
    setDonations((prev) =>
      prev.map((donation) =>
        donation._id === id ? { ...donation, status: "cancelled" } : donation
      )
    );
  } else {
    alert("Failed to cancel donation");
  }
};

  const filtered = donations.filter(d =>
  filter === "All" ||
  (filter === "Claimed" && d.status.toLowerCase() === "claimed") ||
  (filter === "Picked Up" && d.status.toLowerCase() === "picked") ||
  (filter === "Available" && d.status.toLowerCase() === "claimed")||
  (filter === "Cancelled" && d.status.toLowerCase() === "cancelled")

);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return "bg-blue-100 text-blue-600";
      case "claimed":
        return "bg-green-100 text-green-700 font-bold"; // Green + emphasis
      case "picked":
        return "bg-gray-200 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-700 font-bold";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8 w-full">
    <Link
  to="/donor/dashboard"
  className="inline-block text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-2 py-1 rounded ml-2 mb-4"
>
  ← Back
</Link>

      <h2 className="text-3xl font-bold mb-6">My Donations</h2>

      <div className="flex space-x-4 mb-6">
  {["All", "Available", "Cancelled", "Picked Up"].map(status => (
    <button
      key={status}
      onClick={() => setFilter(status)}
      className={`px-4 py-1 rounded-full text-sm font-semibold border ${
        filter === status ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </button>
  ))}
</div>


      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-800 font-semibold">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-center">Category</th>
              <th className="p-3 text-center">Quantity</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Expiry Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No donations to display.
                </td>
              </tr>
            ) : (
              filtered.map(item => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-semibold">{item.itemType}</div>
                    <div className="text-xs text-gray-500">{item.pickupLocation}</div>
                  </td>
                  <td className="text-center">{item.donationType}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="text-center">{item.expiryDate}</td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                     <button className={`${
                        item.status.toLowerCase() === "claimed"
                        ?"text-blue-600 hover:text-blue-800 border bg-blue-50"
                         : "text-gray-400 cursor-not-allowed border bg-gray-100"}px-3 py-1 rounded`}
                          onClick={() => item.status.toLowerCase() === "claimed" && handleEdit(item)}
                        disabled={item.status.toLowerCase() !== "claimed"}
                      >
                          Edit
                        </button>
                      <button
                        className={`${
                        item.status.toLowerCase() === "claimed"
                        ? "text-red-600 hover:text-red-800 border bg-red-50"
                         : "text-gray-400 cursor-not-allowed border bg-gray-100"
                        } px-3 py-1 rounded`}
                        onClick={() => item.status.toLowerCase() === "claimed" && handleCancel(item._id)}
                        disabled={item.status.toLowerCase() !== "claimed"}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
