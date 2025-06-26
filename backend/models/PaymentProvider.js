const mongoose = require('mongoose');

const PaymentProviderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    providerName: {
        type: String,
        required: true,
        enum: ['stripe', 'paypal']
    },
    isConnected: {
        type: Boolean,
        default: false
    },
    accountId: String,
    credentials: Object,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PaymentProvider', PaymentProviderSchema);