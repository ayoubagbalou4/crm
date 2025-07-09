const Notification = require('../models/Notification');

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
    try {
        const { filter } = req.query;
        const userId = req.user.id;
        let query = { userId };

        if (filter === 'unread') {
            query.read = false;
            query.archived = false;
        } else if (filter === 'archived') {
            query.archived = true;
        } else {
            query.archived = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.body;
        await Notification.updateMany(
            { userId, read: false },
            { $set: { read: true } }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Archive a notification
exports.archiveNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { archived: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new notification (used by other services)
exports.createNotification = async (userId , title, message, type) => {
    try {
        const notification = new Notification({
            userId,
            title,
            message,
            type
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};
