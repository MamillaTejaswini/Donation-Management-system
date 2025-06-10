import React, { useEffect, useState } from 'react';
import { getAllDonations, deleteDonation } from '../services/donationService';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function AllDonations() {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const data = await getAllDonations(); // Assumes admin fetch for all donations
      setDonations(data);
    } catch (err) {
      console.error('Failed to fetch donations', err);
    }
  };

const handleDelete = async (id) => {
  try {
    const confirm = window.confirm('Are you sure you want to cancel this donation?');
    if (!confirm) return;

    await deleteDonation(id);
    alert('Donation cancelled successfully');
    // Optionally reload data or remove from UI
  } catch (error) {
    alert(error.message);  // Shows: "Only claimed donations can be cancelled"
  }
};

  const filteredDonations = donations.filter(d =>
    filter === "All" ||
    (filter === "Claimed" && d.status?.toLowerCase() === "claimed") ||
    (filter === "Picked" && d.status?.toLowerCase() === "picked")
  );

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "claimed":
        return "bg-green-100 text-green-700 font-bold";
      case "picked":
        return "bg-gray-200 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-700 font-bold";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <div className="p-8 w-full">
       <Link
  to="/admin/dashboard"
  className="inline-block text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-2 py-1 rounded ml-2 mb-4"
>
  ← Back
</Link>
      <h2 className="text-3xl font-bold mb-6">All Donations</h2>

      <div className="flex space-x-4 mb-6">
        {["All", "Claimed", "Picked"].map((status) => (
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

      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-800 font-semibold">
            <tr>
              <th className="p-3 text-left">Donor Name</th>
              <th className="p-3 text-left">Donor Email</th>
              <th className="p-3 text-center">Donation Type</th>
              <th className="p-3 text-center">Item Type</th>
              <th className="p-3 text-center">Quantity</th>
              <th className="p-3 text-center">Expires By</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Pickup Location</th>
              <th className="p-3 text-center">Picked By</th>
              <th className="p-3 text-center">Claimed Time</th>
              <th className="p-3 text-center">Picked Time</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center p-4 text-gray-500">
                  No donations to display.
                </td>
              </tr>
            ) : (
              filteredDonations.map((d) => (
                <tr key={d._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{d.fullName || "N/A"}</td>
                  <td className="p-3">{d.email || "N/A"}</td>
                  <td className="text-center">{d.donationType}</td>
                  <td className="text-center">{d.itemType}</td>
                  <td className="text-center">{d.quantity}</td>
                  <td className="text-center">{d.expiryDate}</td>
                  <td className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(d.status)}`}>
                      {d.status || "N/A"}
                    </span>
                  </td>
                  <td className="text-center">{d.pickupLocation || "N/A"}</td>
                  <td className="text-center">{d.pickedUpBy || "-"}</td>
                  <td className="text-center">{d.createdAt ? new Date(d.createdAt).toLocaleString() : "-"}</td>
                  <td className="text-center">{d.pickedTime ? new Date(d.pickedTime).toLocaleString() : "-"}</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 border rounded bg-red-50"
                    >
                      <Trash2 className="inline-block w-4 h-4" />
                    </button>
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
