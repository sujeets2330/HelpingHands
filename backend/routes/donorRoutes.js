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
const transporter = require("../config/transporter"); // Import transporter from config

//  Reusable Email Sender
const sendEmail = async (to, subject, html, text) => {
  try {
    await transporter.sendMail({
      from: `"HelpingHands" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });
    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

//  Short Tracking Number Generator
function generateTrackingNumber() {
  const timestampPart = Date.now().toString().slice(-6);
  return `HH-${timestampPart}`;
}

//  Submit Donation
router.post("/submit", async (req, res) => {
  try {
    const { name, mobile, donationType, address, email, message } = req.body;

    if (!name || !mobile || !donationType || !address || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const trackingNumber = generateTrackingNumber();

    const donor = new Donor({
      name,
      mobile,
      donationType,
      address,
      email,
      message,
      trackingNumber,
      status: "Pending",
    });

    await donor.save();

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f5f9ff; padding: 20px;">
        <h2 style="color: #28a745;">Hi ${name},</h2>
        <p>Thank you for your generous donation to <strong>HelpingHands</strong>!</p>
        <p>Your tracking number is:</p>
        <div style="padding: 12px 24px; background-color: #e0f7e9; font-size: 18px; font-weight: bold; border-radius: 5px;">
          ${trackingNumber}
        </div>
        <p style="margin-top: 20px;">You can track your donation <a href="https://www.helpinghands.org/track/${trackingNumber}" target="_blank">here</a>.</p>
        <p>With gratitude,<br><strong>The HelpingHands Team</strong></p>
      </div>
    `;

    const text = `
Hi ${name},

Thank you for your donation to HelpingHands!

Tracking number: ${trackingNumber}
Track your donation: https://www.helpinghands.org/track/${trackingNumber}

— HelpingHands Team
`;

    await sendEmail(email, "Thank You for Your Donation", html, text);

    const io = req.app.get("io");
    if (io) io.emit("newDonor", donor);

    res.redirect("/thank");
  } catch (error) {
    console.error("Error processing donation:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

//  Get All Donors
router.get("/donors", async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ error: "Server error." });
  }
});

//  Track Donation by Number
router.get("/track/:trackingNumber", async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const donor = await Donor.findOne({ trackingNumber });

    if (!donor) {
      return res.status(404).json({ error: "Tracking number not found." });
    }

    res.json({
      name: donor.name,
      donationType: donor.donationType,
      status: donor.status || "Pending",
      updatedAt: donor.updatedAt || "Not Available",
    });
  } catch (error) {
    console.error("Error tracking donation:", error);
    res.status(500).json({ error: "Server error." });
  }
});

//  Update Donation Status
router.put("/donors/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    const donor = await Donor.findByIdAndUpdate(id, { status }, { new: true });
    if (!donor) {
      return res.status(404).json({ error: "Donor not found." });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fffef5;">
        <h2 style="color: #007bff;">Hi ${donor.name},</h2>
        <p>Your donation status has been updated to:</p>
        <div style="padding: 10px 20px; background-color: #f0f8ff; border-left: 5px solid #007bff; font-weight: bold;">
          ${status}
        </div>
        <p>Thank you for your support.<br><strong>— HelpingHands Team</strong></p>
      </div>
    `;

    const text = `
Hi ${donor.name},

Your donation status has been updated to: ${status}

Thank you for your continued support!

— HelpingHands Team
`;

    await sendEmail(donor.email, " Your Donation Status Update", html, text);

    const io = req.app.get("io");
    if (io) io.emit("updateDonor", donor);

    res.json({ message: "Donation status updated successfully.", donor });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Server error." });
  }
});

//  Delete Donation
router.delete("/donors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const donor = await Donor.findByIdAndDelete(id);
    if (!donor) return res.status(404).json({ error: "Donor not found." });

    const io = req.app.get("io");
    if (io) io.emit("deleteDonor", id);

    res.json({ message: "Donation record deleted successfully." });
  } catch (error) {
    console.error("Error deleting donor:", error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;

