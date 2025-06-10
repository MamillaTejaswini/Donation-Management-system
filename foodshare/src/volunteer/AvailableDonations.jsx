// AvailableDonations.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const AvailableDonations = () => {
  const [donations, setDonations] = useState([]);

  const fetchDonations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/donations/claimed");
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error("Failed to fetch claimed donations", error);
    }
  };
const handlePickup = async (donationId) => {
  try {
    const volunteerEmail = localStorage.getItem("email");
 console.log("Volunteer Email:", volunteerEmail);
 console.log("Donation ID:", donationId);


    if (!volunteerEmail) {
      alert("Volunteer email not found. Please login again.");
      return;
    }

    const res = await fetch(`http://localhost:5000/api/donations/pickup/${donationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ volunteerEmail }),
    });

    if (res.ok) {
      alert("Donation marked as picked up!");
      fetchDonations(); // refresh updated list
    } else {
      const error = await res.json();
      alert(error.message || "Failed to update donation.");
    }
  } catch (err) {
    console.error("Pickup error", err);
  }
};


  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="p-6">
       <Link
        to="/volunteer/dashboard"
        className="inline-block text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-2 py-1 rounded ml-2 mb-4"
      >
        ← Back
      </Link>
      <h1 className="text-2xl font-bold mb-4">Available Claimed Donations</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Donor Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">DonationType</th>
            <th className="border p-2">ItemType</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Expiry-Date</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {donations.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No claimed donations available.
              </td>
            </tr>
          ) : (
            donations.map((donation) => (
              <tr key={donation._id}>
                <td className="border p-2">{donation.fullName}</td>
                <td className="border p-2">{donation.email}</td>
                <td className="border p-2">{donation.donationType}</td>
                <td className="border p-2">{donation.itemType}</td>
                <td className="border p-2">{donation.quantity}</td>
                   <td className="border p-2">{donation.expiryDate}</td>
                <td className="border p-2">{donation.pickupLocation}</td>

                <td className="border p-2">
                  <button
                    onClick={() => handlePickup(donation._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Pick Up
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AvailableDonations;
