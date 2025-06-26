const PaymentProvider = require('../models/PaymentProvider');
const TaxSettings = require('../models/TaxSettings');
const SessionPricing = require('../models/SessionPricing');
const PayoutSettings = require('../models/PayoutSettings');

const User = require('../models/User');


// Get all payment providers for a user
exports.getUserPaymentProviders = async (req, res) => {
    try {
        const providers = await PaymentProvider.find({ userId: req.user.id });
        res.json(providers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Connect a payment provider
exports.connectPaymentProvider = async (req, res) => {
    const { providerName, accountId, credentials } = req.body;

    try {
        let provider = await PaymentProvider.findOne({
            userId: req.user.id,
            providerName
        });

        if (provider) {
            // Update existing provider
            provider.isConnected = true;
            provider.accountId = accountId;
            provider.credentials = credentials;
            await provider.save();
        } else {
            // Create new provider
            provider = new PaymentProvider({
                userId: req.user.id,
                providerName,
                isConnected: true,
                accountId,
                credentials
            });
            await provider.save();
        }

        res.json(provider);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Disconnect a payment provider
exports.disconnectPaymentProvider = async (req, res) => {
    const { providerName } = req.body;

    try {
        const provider = await PaymentProvider.findOneAndUpdate(
            { userId: req.user.id, providerName },
            { isConnected: false, accountId: null, credentials: null },
            { new: true }
        );

        if (!provider) {
            return res.status(404).json({ msg: 'Provider not found' });
        }

        res.json(provider);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};




// Get all pricing for a user
exports.getUserSessionPricing = async (req, res) => {
    try {
        const pricing = await SessionPricing.find({ userId: req.user.id });
        res.json(pricing);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create new pricing
exports.createSessionPricing = async (req, res) => {
    const { sessionType, duration, price, currency } = req.body;

    try {
        const newPricing = new SessionPricing({
            userId: req.user.id,
            sessionType,
            duration,
            price,
            currency: currency || 'USD'
        });

        const pricing = await newPricing.save();
        res.json(pricing);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update pricing
exports.updateSessionPricing = async (req, res) => {
    const { sessionType, duration, price, currency } = req.body;

    try {
        let pricing = await SessionPricing.findById(req.params.id);

        if (!pricing) {
            return res.status(404).json({ msg: 'Pricing not found' });
        }

        // Make sure user owns the pricing
        if (pricing.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        pricing.sessionType = sessionType || pricing.sessionType;
        pricing.duration = duration || pricing.duration;
        pricing.price = price || pricing.price;
        pricing.currency = currency || pricing.currency;

        await pricing.save();
        res.json(pricing);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete pricing
exports.deleteSessionPricing = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPricing = await SessionPricing.findByIdAndDelete(id);
        if (!deletedPricing) {
            return res.status(404).json({ error: 'Pricing not found' });
        }
        res.status(200).json({ message: 'Pricing deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete Pricing', details: error.message });
    }
};




// Get tax settings for a user
exports.getUserTaxSettings = async (req, res) => {
    try {
        let taxSettings = await TaxSettings.findOne({ userId: req.user.id });

        if (!taxSettings) {
            // Create default settings if none exist
            taxSettings = new TaxSettings({
                userId: req.user.id,
                isEnabled: false,
                taxRate: 0
            });
            await taxSettings.save();
        }

        res.json(taxSettings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update tax settings
exports.updateTaxSettings = async (req, res) => {
    const { isEnabled, taxRate, country, state } = req.body;

    try {
        let taxSettings = await TaxSettings.findOne({ userId: req.user.id });

        if (!taxSettings) {
            taxSettings = new TaxSettings({ userId: req.user.id });
        }

        taxSettings.isEnabled = isEnabled !== undefined ? isEnabled : taxSettings.isEnabled;
        taxSettings.taxRate = taxRate || taxSettings.taxRate;
        taxSettings.country = country || taxSettings.country;
        taxSettings.state = state || taxSettings.state;

        await taxSettings.save();
        res.json(taxSettings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};




// Get payout settings for a user
exports.getUserPayoutSettings = async (req, res) => {
    try {
        let payoutSettings = await PayoutSettings.findOne({ userId: req.user.id });

        if (!payoutSettings) {
            // Create default settings if none exist
            payoutSettings = new PayoutSettings({
                userId: req.user.id,
                frequency: 'weekly',
                method: 'bank_transfer'
            });
            await payoutSettings.save();
        }

        res.json(payoutSettings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update payout settings
exports.updatePayoutSettings = async (req, res) => {
    const { frequency, method, bankAccount, stripeAccountId } = req.body;

    try {
        let payoutSettings = await PayoutSettings.findOne({ userId: req.user.id });

        if (!payoutSettings) {
            payoutSettings = new PayoutSettings({ userId: req.user.id });
        }

        payoutSettings.frequency = frequency || payoutSettings.frequency;
        payoutSettings.method = method || payoutSettings.method;
        if (bankAccount) payoutSettings.bankAccount = bankAccount;
        if (stripeAccountId) payoutSettings.stripeAccountId = stripeAccountId;

        await payoutSettings.save();
        res.json(payoutSettings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};