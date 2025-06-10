const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    phone: String,
    notes: String,
    history: [
        {
            sessionDate: Date,
            notes: String,
        }
    ]
});

module.exports = mongoose.model("Client", clientSchema);
