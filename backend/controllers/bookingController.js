const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
    try {
        const { clientId, date, time } = req.body;
        const trainerId = req.user.id;

        const existing = await Booking.findOne({ trainerId, date, time });
        if (existing) {
            return res.status(400).json({ message: "Time slot already booked" });
        }

        const booking = await Booking.create({
            trainerId,
            clientId,
            date,
            time,
        });

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ trainerId: req.user.id })
            .populate("clientId", "name email")
            .sort({ date: 1 });
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
