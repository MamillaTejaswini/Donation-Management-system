const express = require('express');
const router = express.Router();
const { getAllDonations,deleteDonation,saveDonation,getDonations,cancelDonation,updateDonation, getClaimedDonations, markDonationPicked,getPickedDonationsByVolunteer } = require('../controllers/donationController');

router.post('/saveDonation', saveDonation);
router.get('/getDonations', getDonations);
router.put('/cancelDonation/:id', cancelDonation);
router.put('/updateDonation/:id', updateDonation);
router.get('/claimed', getClaimedDonations);
router.put('/pickup/:id', markDonationPicked);
router.get("/history", getPickedDonationsByVolunteer);
router.get('/', getAllDonations);
router.delete('/:id', deleteDonation);


module.exports = router;