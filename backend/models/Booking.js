const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    SessionPricingId: { type: mongoose.Schema.Types.ObjectId, ref: "SessionPricing" },
    date: Date,
    time: String,
    notes: String,
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    paid: { type: Boolean, default: false }
});

module.exports = mongoose.model("Booking", bookingSchema);
