const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  updateBooking,
  deleteBooking,
  getBookingsByClient,
  bookingsReminders
} = require("../controllers/bookingController");

// router.use(authMiddleware);

router.get("/bookingsreminders", bookingsReminders);   
router.post("/bookings", authMiddleware , createBooking); 
router.get("/bookings", authMiddleware , getBookings);   
router.get("/bookings/:id", authMiddleware , getBooking);   
router.get("/bookingsByClient/:id", authMiddleware , getBookingsByClient);   
router.patch("/bookings/:id/cancel", authMiddleware , cancelBooking); 
router.put("/bookings/:id", authMiddleware , updateBooking);
router.delete("/bookings/:id", authMiddleware , deleteBooking);

module.exports = router;





