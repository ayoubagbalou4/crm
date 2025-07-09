const Client = require("../models/Client");
const Booking = require("../models/Booking");
const Notification = require('../models/Notification');

exports.getDashboardStats = async (req, res) => {
    try {
        const trainerId = req.user.id;

        const [clientCount, bookingCount, notificationCount, upcomingBookingCount] = await Promise.all([
            Client.countDocuments({ userId: trainerId }),
            Booking.countDocuments({ trainerId }),
            Notification.countDocuments({ userId: trainerId, read: false }),
            Booking.countDocuments({
                trainerId,
                status: 'confirmed',
                date: { $gte: new Date() }
            })
        ]);


        const bookings = await Booking.find({ trainerId }).select('clientId');
        const bookingMap = {};
        for (const booking of bookings) {
            const id = booking.clientId.toString();
            bookingMap[id] = (bookingMap[id] || 0) + 1;
        }

        const sortedClients = Object.entries(bookingMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const topClients = await Promise.all(
            sortedClients.map(async ([clientId, bookingCount]) => {
                const client = await Client.findById(clientId).select('fullName email phone');
                return {
                    fullName: client?.fullName || "Unknown",
                    email: client?.email || "",
                    phone: client?.phone || "",
                    bookingCount
                };
            })
        );

        res.status(200).json({
            clients: clientCount,
            bookings: bookingCount,
            notifications: notificationCount,
            upcomingBookingCount,
            topClients
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
