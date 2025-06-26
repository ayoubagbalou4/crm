const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    archiveNotification
} = require('../controllers/notificationController');

const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware)

router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markAsRead);
router.patch('/notifications/mark-all-read', markAllAsRead);
router.patch('/notifications/:id/archive', archiveNotification);

module.exports = router;
