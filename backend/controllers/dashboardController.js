const Client = require("../models/Client");
const Booking = require("../models/Booking");

exports.getDashboardStats = async (req, res) => {
    try {
        const trainerId = req.user.id;

        const [clientCount, bookingCount] = await Promise.all([
            Client.countDocuments({ userId:trainerId }),
            Booking.countDocuments({ trainerId }),
        ]);

        res.status(200).json({
            clients: clientCount,
            bookings: bookingCount,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
