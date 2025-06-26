const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getSettings,
  updateSettings
} = require("../controllers/availabilitySettingsController");

router.use(authMiddleware);

router.get("/settings", getSettings); 
router.put("/settings", updateSettings);  

module.exports = router;





