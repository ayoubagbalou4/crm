const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['booking', 'payment', 'reminder', 'message', 'system'],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    archived: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

notificationSchema.index({ userId: 1, read: 1, archived: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);