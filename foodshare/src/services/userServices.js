const API_URL = "http://localhost:5000/api/user";

export async function fetchAllUsers() {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
