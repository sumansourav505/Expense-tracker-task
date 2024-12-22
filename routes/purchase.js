const express = require('express');
const purchaseController = require('../controllers/purchase');
const authenticateController = require('../middleware/auth');
const router = express.Router();

router.get(
    '/premium-membership',
    authenticateController.authenticate,
    purchaseController.purchasePremium
);
router.post(
    '/updateTransactionStatus',
    authenticateController.authenticate,
    purchaseController.updateTransactionStatus // Ensure the controller method is implemented
);

module.exports = router;
