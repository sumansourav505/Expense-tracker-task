const express = require('express');
const purchaseController = require('../controllers/purchase');
const authenticateController = require('../middleware/auth');

const router = express.Router();

router.get(
    '/premium-membership',
    authenticateController.authenticate,
    purchaseController.purchasePremium
);

module.exports = router;
