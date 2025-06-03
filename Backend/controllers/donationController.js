const Donation = require('../models/Donation');
const mongoose = require('mongoose');
const { markUserActive } = require('../utils/activityTracker');


exports.saveDonation = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    donationType,
    itemType,
    quantity,
    expiryDate,
    pickupLocation,
  } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const donation = new Donation({
      fullName,
      email,
      phone,
      donationType,
      itemType,
      quantity,
      expiryDate,
      pickupLocation,
      status: "claimed",
    });

    await donation.save();
    await markUserActive(email);
    res.status(201).json({ message: "Donation saved successfully" });
  } catch (error) {
    console.error("Donation saving error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDonations = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const donations = await Donation.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.cancelDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status.toLowerCase() !== "claimed") {
      return res.status(400).json({ message: "Only claimed donations can be cancelled" });
    }

    donation.status = "cancelled";
    await donation.save();
    await markUserActive(donation.email);
    res.status(200).json({ message: "Donation cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDonation = await Donation.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    await markUserActive(updateDonation.email);
    res.status(200).json({ message: "Donation updated successfully", updatedDonation });
  } catch (error) {
    console.error("Error updating donation:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getClaimedDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "claimed" }).sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching claimed donations:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.markDonationPicked = async (req, res) => {
  try {
    const donationId = req.params.id;
    const { volunteerEmail } = req.body;
    console.log("markDonationPicked called with:", donationId, volunteerEmail);
    if (!volunteerEmail) {
      return res.status(400).json({ message: "Volunteer email required" });
    }

    // Validate donationId format (optional)
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      {
        status: "picked",
        pickedUpBy: volunteerEmail,
        pickedTime: new Date(),
      },
      { new: true }
    );

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }
 await markUserActive(volunteerEmail);
    res.json({ message: "Donation marked as picked up!", updatedDonation });
  } catch (error) {
    console.error("Error in markDonationPicked:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// GET /api/donations/history?email=volunteer@example.com
exports.getPickedDonationsByVolunteer = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Volunteer email is required" });
  }

  try {
    const donations = await Donation.find({
      pickedUpBy: email,
      status: "picked"
    }).sort({ pickedTime: -1 });

    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching picked donation history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status && status !== 'All') {
      filter.status = status.toLowerCase();
    }

    const donations = await Donation.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

// Delete or cancel donation
exports.deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid donation ID' });
    }

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.status !== 'claimed') {
      return res.status(400).json({ error: 'Only claimed donations can be cancelled' });
    }

    donation.status = 'cancelled';
    
    await donation.save();
await markUserActive(donation.email);
    res.status(200).json({ message: 'Donation cancelled successfully' });
 
  } catch (error) {
    console.error('Error cancelling donation:', error);
    res.status(500).json({ error: 'Failed to cancel donation' });
  }
};