const express = require('express');
const purchaseController = require('../controllers/purchase');
const authenticateController = require('../middleware/auth');

const router = express.Router();

router.post(
    '/premium-membership',
    authenticateController.authenticate,
    purchaseController.purchasePremium
);
router.post(
    '/updateTransactionStatus',
    authenticateController.authenticate,
    purchaseController.updateTransactionStatus
);

module.exports = router;
