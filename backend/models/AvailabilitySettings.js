const mongoose = require('mongoose');

const availabilitySettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    daysAvailable: {
        type: Map,
        of: Boolean,
        default: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false
        }
    },
    startTime: {
        type: String,
        required: true,
        default: '08:00'
    },
    endTime: {
        type: String,
        required: true,
        default: '18:00'
    },
    breakStart: {
        type: String,
        required: true,
        default: '12:00'
    },
    breakEnd: {
        type: String,
        required: true,
        default: '13:00'
    },
    sessionDuration: {
        type: Number,
        required: true,
        default: 60
    },
    bufferTime: {
        type: Number,
        required: true,
        default: 15
    },
    timezone: {
        type: String,
        required: true,
        default: '(GMT-08:00) Pacific Time (US & Canada)'
    }
});

module.exports = mongoose.model('AvailabilitySettings', availabilitySettingsSchema);
