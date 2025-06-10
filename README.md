# Donation Management System

The **Donation Management System** is a web-based platform designed to facilitate the donation and redistribution of food and essential items. It connects donors with volunteers who can claim and deliver items to those in need, streamlining the process through a user-friendly interface and role-based access.

## 🌟 Features

- 🧑‍🤝‍🧑 **Role-Based Access**: Donors, Volunteers, and Admins each have specific capabilities and dashboards.
- 🎁 **Donation Posting**: Donors can create new food or item donation entries.
- 🚚 **Claim & Deliver**: Volunteers can claim donations and mark them as delivered.
- 📊 **Tracking**: Users can track the status of their donations (Pending, Claimed, Delivered).
- 🔐 **Authentication & Authorization**: Secure login and access control using JWT.

## 🛠️ Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Others**: Mongoose, Axios, JWT, Bcrypt

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/donation-management-system.git
   cd donation-management-system
2.**Set up the backend:**

```bash
cd backend
npm install
npm run dev
```
3.**Set up the frontend:**

```bash
cd ../frontend
npm install
npm start
```
4.**Environment Variables:**
Create .env files in both frontend and backend folders with necessary configuration like:

**Backend .env:**
```bash
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
```
**Frontend .env:**
```bash
REACT_APP_API_URL=http://localhost:5000/api
```
