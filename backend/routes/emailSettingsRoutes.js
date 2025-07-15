const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { saveSettings , updateEmailSettings } = require("../controllers/emailSettingsController");
router.use(authMiddleware);

router.get('/emailSettings', saveSettings);
router.put('/emailSettings', updateEmailSettings);

module.exports = router;