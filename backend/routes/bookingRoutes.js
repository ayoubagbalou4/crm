const router = require("express").Router();
const { authMiddleware } = require("../middleware/auth");
const {
  createBooking, getBookings, cancelBooking
} = require("../controllers/bookingController");

router.use(authMiddleware);

router.post("/", createBooking);
router.get("/", getBookings);
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
