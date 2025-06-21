const Booking = require("../models/Booking");

// Create a booking
exports.createBooking = async (req, res) => {
    try {
        const { clientId, date, time, notes } = req.body;
        const trainerId = req.user.id;

        const exists = await Booking.findOne({ trainerId, date, time, status: "confirmed" });
        if (exists) return res.status(400).json({ message: "Time slot already booked" });

        const booking = await Booking.create({
            trainerId,
            clientId,
            date,
            time,
            notes,
        });

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
