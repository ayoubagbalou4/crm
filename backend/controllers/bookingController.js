const Booking = require("../models/Booking");
const SessionPricing = require('../models/SessionPricing');
const Client = require('../models/Client');
const { createNotification } = require("./notificationController");

// Create a booking
exports.createBooking = async (req, res) => {
    try {
        const { clientId, SessionPricingId, date, time, notes } = req.body;
        const trainerId = req.user.id;

        const exists = await Booking.findOne({ trainerId, date, time, status: "confirmed" });
        const session = await SessionPricing.findOne({ _id: SessionPricingId });
        const client = await Client.findOne({ _id: clientId });
        if (exists) return res.status(400).json({ message: "Time slot already booked" });

        const booking = await Booking.create({
            trainerId,
            clientId,
            SessionPricingId,
            date,
            time,
            notes,
        });
        createNotification(
            trainerId,
            "New booking confirmed",
            `New ${session.sessionType} session booked with ${client.fullName} on ${date} at ${time}`,
            "booking"
        )

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const trainerId = req.user.id;
        const bookings = await Booking.find({ trainerId })
            .populate("clientId")
            .populate("SessionPricingId")
            .sort({ date: 1 });

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id)
            .populate("clientId")
            .populate("SessionPricingId")
        if (!booking) {
            return res.status(404).json({ error: 'booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve booking', details: error.message });
    }
};


exports.getBookingsByClient = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.find({ clientId: id })
            .populate("clientId")
            .populate("SessionPricingId")
        if (!booking) {
            return res.status(404).json({ error: 'booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve booking', details: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, trainerId: req.user.id },
            { status: "cancelled" },
            { new: true }
        );

        if (!booking) return res.status(404).json({ message: "Booking not found" });
        res.status(200).json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const { date, time } = req.body;
        const trainerId = req.user.id;

        const conflict = await Booking.findOne({ trainerId, date, time, status: "confirmed", _id: { $ne: req.params.id } });
        if (conflict) return res.status(400).json({ message: "Time slot already booked" });

        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, trainerId },
            { date, time },
            { new: true }
        );

        if (!booking) return res.status(404).json({ message: "Booking not found" });
        res.status(200).json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete Booking', details: error.message });
    }
};




exports.bookingsReminders = async (req, res) => {
    const range = req.query.range || 'today';
    const now = new Date();
    let start, end;

    if (range === 'today') {
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
    } else if (range === 'tomorrow') {
        start = new Date(now.setDate(now.getDate() + 1));
        start.setHours(0, 0, 0, 0);
        end = new Date(now.setDate(now.getDate() + 1));
        end.setHours(23, 59, 59, 999);
    }

    const bookings = await Booking.find({
        date: { $gte: start, $lte: end }
    }).populate('clientId trainerId');

    res.json(bookings);
};
