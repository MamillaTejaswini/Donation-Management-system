import React, { useEffect,useState } from "react";
import { useLocation } from 'react-router-dom';


export default function DonateForm() {
const location = useLocation();
const editData = location.state?.donation || null;
const isEdit = location.state?.isEdit || false;
  const [formData, setFormData] = useState({
  fullName: editData?.fullName || "",
  email: editData?.email || "",
  phone: editData?.phone || "",
  donationType: editData?.donationType || "food",
  itemType: editData?.itemType || "",
  quantity: editData?.quantity || "",
  expiryDate: editData?.expiryDate || "",
  pickupLocation: editData?.pickupLocation || "",
  itemImage: null,
});

useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    console.log("Stored email:", storedEmail);
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDonationType = (type) => {
    setFormData((prev) => ({ ...prev, donationType: type }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

const donationData = {
  fullName: formData.fullName,
  email: formData.email,
  phone: formData.phone,
  donationType: formData.donationType,
  itemType: formData.itemType,
  quantity: formData.quantity,
  expiryDate: formData.expiryDate,
  pickupLocation: formData.pickupLocation,
};

const url = isEdit
  ? `http://localhost:5000/api/donations/updateDonation/${editData._id}`
  : `http://localhost:5000/api/donations/saveDonation`;

const method = isEdit ? "PUT" : "POST";

try {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(donationData),
  });

  const data = await response.json();

  if (data.success) {
    alert(isEdit ? "Donation updated!" : "Donation submitted! Thank you.");
  } else {
    alert("Error: " + data.message);
  }
} catch (err) {
  alert("Failed to submit donation. Please try again later.");
  console.error(err);
}
  }
  const renderDonationDetails = () => (
    <div className="mt-8">
      <h4 className="text-lg font-semibold mb-4">
        {formData.donationType === "food" ? "Food Donation Details" : "Item Donation Details"}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">
            {formData.donationType === "food" ? "Food Type *" : "Item Type *"}
          </label>
          <input
            type="text"
            name="itemType"
            required
            value={formData.itemType}
            onChange={handleChange}
            placeholder={formData.donationType === "food" ? "e.g., Canned goods, Fresh produce, etc" : "e.g., Clothes, Electronics, etc"}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Quantity *</label>
          <input
            type="text"
            name="quantity"
            required
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g., 5 kg, 10 items, 3 boxes"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        {formData.donationType === "food" && (
          <div>
            <label className="block mb-1 font-medium">Expiry Date (if applicable)</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}
        <div>
          <label className="block mb-1 font-medium">Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            placeholder="Enter your address"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block mb-1 font-medium">{formData.donationType === "food" ? "Food Image (optional)" : "Item Image (optional)"}</label>
        <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            name="itemImage"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleChange}
            className="hidden"
            id="itemImageUpload"
          />
          <label htmlFor="itemImageUpload" className="cursor-pointer">
            <div className="text-2xl">⬆️</div>
            <div className="text-gray-500 mt-1">Click to upload an image</div>
            <div className="text-sm text-gray-400">JPEG, PNG, GIF up to 5MB</div>
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Adding an image helps us better prepare for pickup and distribution.
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col items-center justify-start p-6">
     
      <div className="text-center">
        <div className="flex items-center justify-center text-2xl font-bold">
          <span className="text-green-600 mr-2">💚</span> DonateKindly
        </div>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          Your generosity makes a difference. Fill out the form below to start your donation process.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 mt-6 max-w-3xl w-full"
      >
        <h2 className="text-2xl font-semibold mb-4">Donation Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              // onChange={handleChange}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">What would you like to donate?</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => handleDonationType("food")}
            className={`border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
              formData.donationType === "food"
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
          >
            <div className="text-4xl mb-2">🍕</div>
            <div className="font-semibold text-lg">Food Donation</div>
            <div className="text-gray-600">
              Donate food items like groceries, prepared meals, etc.
            </div>
          </div>

          <div
            onClick={() => handleDonationType("other")}
            className={`border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
              formData.donationType === "other"
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
          >
            <div className="text-4xl mb-2">📦</div>
            <div className="font-semibold text-lg">Other Donation</div>
            <div className="text-gray-600">
              Donate clothing, household items, electronics, etc.
            </div>
          </div>
        </div>

        {renderDonationDetails()}

        <button
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
}
