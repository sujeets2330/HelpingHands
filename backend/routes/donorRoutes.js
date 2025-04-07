// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const Donor = require('../models/Donor');
// const transporter = require('../config/transporter'); 

// // Handle form submission
// router.post('/submit', async (req, res) => {
//     try {
//         console.log('Received form data:', req.body);
//         const { Name, Mobile, donation, Address, Email, Message } = req.body;

//         if (!Name || !Mobile || !donation || !Address || !Email || !Message) {
//             return res.status(400).json({ error: 'All fields are required.' });
//         }

//         // Save donor details in DB
//         const donor = new Donor({ Name, Mobile, donation, Address, Email, Message });
//         await donor.save();
//         console.log('Donor saved:', donor);

//         // Send email to the donor
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: Email,
//             subject: 'Donation Tracking Number',
//             text: `Hello ${Name},\n\nThank you for your donation! Your tracking number is: ${donor._id}\n\nBest Regards,\nYour Organization`
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error('Error sending email:', error);
//             } else {
//                 console.log('Email sent:', info.response);
//             }
//         });

//         // Redirect to thank-you page
//         res.redirect('/thank');
//     } catch (error) {
//         console.error('Error processing donation:', error);
//         res.status(500).json({ error: 'There was an error processing your request. Please try again later.' });
//     }
// });

// // Fetch tracking details by tracking number (_id)
// router.get('/track/:trackingNumber', async (req, res) => {
//     try {
//         const { trackingNumber } = req.params;

//         // Ensure tracking number is an ObjectId
//         const donor = await Donor.findOne({ _id: new mongoose.Types.ObjectId(trackingNumber) });

//         if (!donor) {
//             return res.status(404).json({ error: "Tracking number not found." });
//         }

//         res.json({
//             name: donor.Name,
//             donation: donor.donation,
//             status: donor.status || "Pending",
//             updatedAt: donor.updatedAt || "Not Available"
//         });
//     } catch (error) {
//         console.error('Error fetching tracking details:', error);
//         res.status(500).json({ error: "Server error. Please try again later." });
//     }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");
const transporter = require("../config/transporter");
const { v4: uuidv4 } = require("uuid");

// Handle form submission
router.post("/submit", async (req, res) => {
    try {
        console.log("Received form data:", req.body);
        const { name, mobile, donationType, address, email, message } = req.body;

        if (!name || !mobile || !donationType || !address || !email || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const trackingNumber = uuidv4();

        const donor = new Donor({
            name,
            mobile,
            donationType,
            address,
            email,
            message,
            trackingNumber,
            status: "Pending" 
        });

        await donor.save();
        console.log("Donor saved:", donor);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Donation Tracking Number",
            text: `Hello ${name},\n\nThank you for your donation! Your tracking number is: ${trackingNumber}\n\nBest Regards,\nYour Organization`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error("Error sending email:", error);
            else console.log("Email sent:", info.response);
        });

        const io = req.app.get("io");  
        if (io) io.emit("newDonor", donor);

        res.redirect('/thank');
    } catch (error) {
        console.error("Error processing donation:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

// Fetch all donors
router.get("/donors", async (req, res) => {
    try {
        const donors = await Donor.find().sort({ createdAt: -1 });
        res.json(donors);
    } catch (error) {
        console.error("Error fetching donors:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

// Fetch tracking details by tracking number
router.get("/track/:trackingNumber", async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        console.log("Received Tracking Number:", trackingNumber);

        const donor = await Donor.findOne({ trackingNumber });

        if (!donor) {
            console.log("No donor found for tracking number:", trackingNumber);
            return res.status(404).json({ error: "Tracking number not found." });
        }

        console.log("Donor found:", donor);

        res.json({
            name: donor.name,
            donationType: donor.donationType,
            status: donor.status || "Pending",
            updatedAt: donor.updatedAt || "Not Available"
        });
    } catch (error) {
        console.error("Error fetching tracking details:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

// Update donation status
router.put("/donors/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) return res.status(400).json({ error: "Status is required." });

        const donor = await Donor.findByIdAndUpdate(id, { status }, { new: true });

        if (!donor) {
            return res.status(404).json({ error: "Donor not found." });
        }

        console.log("Status updated:", donor);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: donor.email,
            subject: "Donation Status Updated",
            text: `Hello ${donor.name},\n\nYour donation status has been updated to: ${status}.\n\nBest Regards,\nYour Organization`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error("Error sending email:", error);
            else console.log("Email sent:", info.response);
        });

        const io = req.app.get("io"); 
        if (io) io.emit("updateDonor", donor);

        res.json({ message: "Donation status updated successfully.", donor });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

// Delete a donor by ID
router.delete("/donors/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const donor = await Donor.findByIdAndDelete(id);
        if (!donor) return res.status(404).json({ error: "Donor not found." });

        console.log("Donor deleted:", donor);

        // Notify all clients about the deletion
        req.app.get("io").emit("deleteDonor", id);

        res.json({ message: "Donation record deleted successfully." });
    } catch (error) {
        console.error("Error deleting donor:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});


module.exports = router;

