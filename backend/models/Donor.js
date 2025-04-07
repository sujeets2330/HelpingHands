const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    donationType: String,
    address: String,
    email: String,
    message: String,
    trackingNumber: { type: String, unique: true, required: true }, 
    status: { type: String, default: "Pending" }
}, { timestamps: true });

const Donor = mongoose.model("Donor", donorSchema);
module.exports = Donor;
