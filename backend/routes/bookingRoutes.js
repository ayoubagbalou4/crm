const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  updateBooking,
} = require("../controllers/bookingController");

router.use(authMiddleware);

router.post("/bookings", createBooking); 
router.get("/bookings", getBookings);   
router.get("/bookings/:id", getBooking);   
router.patch("/bookings/:id/cancel", cancelBooking); 
router.put("/bookings/:id", updateBooking);

module.exports = router;





