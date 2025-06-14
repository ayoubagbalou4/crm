const Client = require("../models/Client");

exports.createClient = async (req, res) => {
    try {
        const { fullName, email, phone, gender, birthDate, address, notes, tags } = req.body;
        const userId = req.user.id;

        const client = Client({
            userId,
            fullName,
            email,
            phone,
            gender,
            birthDate,
            address,
            notes,
            tags
        });
        await client.save()
        res.status(201).json({ status: true, client });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getClients = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const userId = req.user.id;

        const query = {
            userId,
            ...(search && {
                $or: [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } }
                ]
            })
        };

        const clients = await Client.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalItems = await Client.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            clients,
            totalItems,
            totalPages,
            currentPage: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ error: 'client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve client', details: error.message });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findByIdAndUpdate(
            id,
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
        const { id } = req.params;
        const deletedClient = await Client.findByIdAndDelete(id);
        if (!deletedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete Client', details: error.message });
    }
};
