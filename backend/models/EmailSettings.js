const mongoose = require('mongoose');

const emailSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    notifications: {
        newBooking: { type: Boolean, default: true },
        bookingChanges: { type: Boolean, default: true },
        paymentReceipts: { type: Boolean, default: true },
        newsletter: { type: Boolean, default: false }
    },
    reminders: {
        enabled: { type: Boolean, default: true },
        firstReminder: { type: String, default: '48 hours before' },
        secondReminder: { type: String, default: '2 hours before' }
    },
    template: {
        signature: { type: String, default: 'Best regards,\nJohn Doe\nCertified Personal Trainer\nPhone: (555) 123-4567' },
        headerImage: { type: String, default: 'https://via.placeholder.com/150' }
    },
    updatedAt: { type: Date, default: Date.now }
});

emailSettingsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('EmailSettings', emailSettingsSchema);