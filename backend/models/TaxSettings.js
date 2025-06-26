const mongoose = require('mongoose');

const TaxSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isEnabled: {
        type: Boolean,
        default: false
    },
    taxRate: {
        type: Number,
        default: 0
    },
    country: String,
    state: String
}, { timestamps: true });

module.exports = mongoose.model('TaxSettings', TaxSettingsSchema);