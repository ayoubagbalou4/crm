const Client = require("../models/Client");

exports.createClient = async (req, res) => {
    try {
        const { name, email, phone, notes } = req.body;
        const trainerId = req.user.id;

        const client = await Client.create({
            trainerId,
            name,
            email,
            phone,
            notes,
        });

        res.status(201).json(client);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find({ trainerId: req.user.id });
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getClient = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            trainerId: req.user.id,
        });
        if (!client) return res.status(404).json({ message: "Client not found" });

        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, trainerId: req.user.id },
            req.body,
            { new: true }
        );
        if (!client) return res.status(404).json({ message: "Client not found" });

        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({
            _id: req.params.id,
            trainerId: req.user.id,
        });
        if (!client) return res.status(404).json({ message: "Client not found" });

        res.status(200).json({ message: "Client deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
