import React, { useEffect, useState } from "react";

const PickupHistory = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const volunteerEmail = localStorage.getItem("email");

      if (!volunteerEmail) {
        alert("Login required to view history");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/donations/history?email=${volunteerEmail}`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };
useEffect(() => {
    fetchHistory();
  }, []);
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pickup History</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Donor Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Donation Type</th>
            <th className="border p-2">Item Type</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Expiry Date</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Created Time</th>
            <th className="border p-2">Picked Time</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center p-4">
                No pickups found.
              </td>
            </tr>
          ) : (
            history.map((donation) => (
              <tr key={donation._id}>
                <td className="border p-2">{donation.fullName}</td>
                <td className="border p-2">{donation.email}</td>
                <td className="border p-2">{donation.donationType}</td>
                <td className="border p-2">{donation.itemType}</td>
                <td className="border p-2">{donation.quantity}</td>
                <td className="border p-2">{donation.expiryDate}</td>
                <td className="border p-2">{donation.pickupLocation}</td>
                <td className="border p-2">{new Date(donation.createdAt).toLocaleString()}</td>
                <td className="border p-2">{new Date(donation.pickedTime).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PickupHistory;
