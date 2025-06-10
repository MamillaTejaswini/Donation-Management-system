import React, { useEffect, useState } from 'react';
import { getDonations } from '../../services/donationService';
import { Link } from 'react-router-dom';

export default function HistoryPage() {
  const [donations, setDonations] = useState([]);

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

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-blue-100 text-blue-600";
      case "claimed":
        return "bg-green-100 text-green-700 font-bold";
      case "picked":
        return "bg-gray-200 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-700 font-bold";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString(); // includes time
  };

  return (
    <div className="p-8 w-full">
      <Link
  to="/donor/dashboard"
  className="inline-block text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-2 py-1 rounded ml-2 mb-4"
>
  ← Back
</Link>
 
      <h2 className="text-3xl font-bold mb-6">Donation History</h2>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-800 font-semibold">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-center">Category</th>
              <th className="p-3 text-center">Quantity</th>
              <th className="p-3 text-center">Pickup Location</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Expiry Date</th>
              <th className="p-3 text-center">Created Time</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No donation history found.
                </td>
              </tr>
            ) : (
              donations.map(item => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-semibold">{item.itemType}</td>
                  <td className="text-center">{item.donationType}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">{item.pickupLocation}</td>
                  <td className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="text-center">{item.expiryDate}</td>
                  <td className="text-center">{formatDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
