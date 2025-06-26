const mongoose = require('mongoose');

const PayoutSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
        default: 'weekly'
    },
    method: {
        type: String,
        enum: ['stripe_balance', 'bank_transfer'],
        default: 'bank_transfer'
    },
    bankAccount: Object,
    stripeAccountId: String
}, { timestamps: true });

module.exports = mongoose.model('PayoutSettings', PayoutSettingsSchema);