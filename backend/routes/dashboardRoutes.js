const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/dashboardController");

router.use(authMiddleware);

router.get("/stats", getDashboardStats);

module.exports = router;
