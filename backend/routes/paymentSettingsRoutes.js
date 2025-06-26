const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

const {
  getUserPaymentProviders,
  connectPaymentProvider,
  disconnectPaymentProvider,
  getUserSessionPricing,
  createSessionPricing,
  updateSessionPricing,
  deleteSessionPricing,
  getUserTaxSettings,
  updateTaxSettings,
  getUserPayoutSettings,
  updatePayoutSettings
} = require('../controllers/paymentSettingsController');

router.use(authMiddleware);

// Payment Providers
router.get('/providers', getUserPaymentProviders);
router.post('/providers/connect', connectPaymentProvider);
router.post('/providers/disconnect', disconnectPaymentProvider);

// Session Pricing
router.get('/pricing', getUserSessionPricing);
router.post('/pricing', createSessionPricing);
router.put('/pricing/:id', updateSessionPricing);
router.delete('/pricing/:id', deleteSessionPricing);

// Tax Settings
router.get('/tax', getUserTaxSettings);
router.put('/tax', updateTaxSettings);

// Payout Settings
router.get('/payout', getUserPayoutSettings);
router.put('/payout', updatePayoutSettings);

module.exports = router;