const API_URL = "http://localhost:5000/api/donations"; // Match your backend port
export async function getDonations(email) {
  const res = await fetch(`${API_URL}/getDonations?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Failed to fetch donations");
  return res.json();
}

export async function cancelDonation(id) {
  const res = await fetch(`${API_URL}/cancelDonation/${id}`, {
    method: "PUT",
  });
  return res.ok;
}
export async function updateDonation(id, updatedData) {
  const res = await fetch(`${API_URL}/updateDonation/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    throw new Error("Failed to update donation");
  }

  return res.json(); // returns { message: "...", updatedDonation }
}
export async function getClaimedDonations() {
  const res = await fetch(`${API_URL}/claimed`);
  if (!res.ok) throw new Error("Failed to fetch claimed donations");
  return res.json();
}

export async function markDonationPicked(donationId, volunteerEmail) {
  const res = await fetch(`${API_URL}/pickup/${donationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ volunteerEmail }),
  });
  if (!res.ok) throw new Error("Failed to mark donation as picked");
  return res.json(); // or just return res.ok if you prefer
}
export async function getPickedDonationsByVolunteer(email) {
  const res = await fetch(`${API_URL}/history?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Failed to fetch volunteer history");
  return res.json();
}
export async function getAllDonations(){
  const response = await fetch(`${API_URL}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch donations');
  }
  return await response.json();
};

export const deleteDonation = async (id) => {
  if (!id || id.length !== 24) {
    throw new Error("Invalid donation ID");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete donation');
  }

  return true;
};



