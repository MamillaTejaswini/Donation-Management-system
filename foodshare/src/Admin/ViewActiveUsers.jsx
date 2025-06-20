
import { useEffect, useState, useMemo } from "react";
import { fetchAllUsers } from "../services/userServices";
import { Link } from "react-router-dom";
export default function ActiveUserManagement() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "All",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch(console.error);
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const nameMatch = user.fullName
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const emailMatch = user.email
        .toLowerCase()
        .includes(filters.email.toLowerCase());
      const roleMatch =
        filters.role === "All" || user.role === filters.role.toLowerCase();

      const statusMatch = user.active === true;

      return nameMatch && emailMatch && roleMatch && statusMatch;
    });
  }, [users, filters]);

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;

    const sorted = [...filteredUsers].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "createdAt" || sortConfig.key === "lastActive") {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredUsers, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
       <Link
  to="/admin/dashboard"
  className="inline-block text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-2 py-1 rounded ml-2 mb-4"
>
  ← Back
</Link>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
        Active Users
      </h1>
      <p className="text-gray-600 mb-6">
        Displaying all active users. Use the filters below to refine your
        search.
      </p>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <input
          type="text"
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <input
          type="text"
          placeholder="Filter by email"
          value={filters.email}
          onChange={(e) => handleFilterChange("email", e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange("role", e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Donor">Donor</option>
          <option value="Volunteer">Volunteer</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              {[
                { label: "Full Name", key: "fullName" },
                { label: "Email", key: "email" },
                { label: "Role", key: "role" },
                { label: "Joined", key: "createdAt" },
                { label: "Last Active", key: "lastActive" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => requestSort(key)}
                  className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-900"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <span className="text-indigo-600">{getSortIndicator(key)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sortedUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  No active users found.
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-indigo-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize text-indigo-600 font-semibold">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {user.lastActive
                      ? new Date(user.lastActive).toLocaleString()
                      : "Never"}
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

