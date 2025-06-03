
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Profile = () => {
  const email = localStorage.getItem("email");
  const fullName = localStorage.getItem("fullName");
  const role =  localStorage.getItem("role");
  console.log(role);
  const [userData, setUserData] = useState({
    fullName: fullName || '',
    email: email || '',
    phone: localStorage.getItem("phone")|| '',
    location:localStorage.getItem("location") || '',
  });

  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (!email) return;

    axios.get(`http://localhost:5000/api/user/email/${email}`)
      .then(res => {
          console.log("User data from backend:", res.data); 
        setUserData(prev => ({
          ...prev,
          phone: res.data.phone || '',
          location: res.data.location || '',
      
        }));
        localStorage.setItem("phone", res.data.phone || "");
    localStorage.setItem("location", res.data.location || "");
      })
      .catch(err => console.error('Error fetching user:', err));
  }, [email]);
const getDashboardPath = () => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'volunteer':
      return '/volunteer/dashboard';
    case 'donor':
    default:
      return '/donor/dashboard';
  }
};
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/user/update', {
        email: userData.email,
        phone: userData.phone,
        location: userData.location
      });
      localStorage.setItem("phone", userData.phone);
localStorage.setItem("location", userData.location);

      setIsEditable(false);
      alert("Profile updated!");
    } catch (err) {
      console.error('Error updating profile:', err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Link to={getDashboardPath()} className="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow">
        ← Back to Dashboard
      </Link>

      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-8 text-center">My Profile</h2>

        <div className="mb-8 flex flex-wrap gap-10 justify-between">
          <div className="flex-1 min-w-[300px]">
            <p className="text-gray-600 font-semibold mb-1">Full Name:</p>
            <p className="text-lg">{userData.fullName}</p>
          </div>

          <div className="flex-1 min-w-[300px]">
            <p className="text-gray-600 font-semibold mb-1">Email:</p>
            <p className="text-lg">{userData.email}</p>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-10 justify-between">
          <div className="flex-1 min-w-[300px]">
            <label
              className="block text-gray-600 font-semibold mb-1"
              htmlFor="phone"
            >
              Phone:
            </label>
            {isEditable ? (
              <input
                id="phone"
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone"
              />
            ) : (
              <p className="text-lg">{userData.phone || 'Not set'}</p>
            )}
          </div>

          <div className="flex-1 min-w-[300px]">
            <label
              className="block text-gray-600 font-semibold mb-1"
              htmlFor="location"
            >
              Location:
            </label>
            {isEditable ? (
              <input
                id="location"
                type="text"
                name="location"
                value={userData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location"
              />
            ) : (
              <p className="text-lg">{userData.location || 'Not set'}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          {isEditable ? (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditable(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
