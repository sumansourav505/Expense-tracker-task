const Razorpay = require('razorpay');
const Order = require('../models/order');

const purchasePremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: 'rzp_test_1b9Jf64RDHMzan',
            key_secret:'2Xu5JgnU2cRTlDaUIMZPKJkE',
        });

        const amount = 2500; // Amount in paise (₹25.00)

        // Create Razorpay order
        const order = await rzp.orders.create({ amount, currency: "INR" });

        // Save order in the database
        await req.user.createOrder({
            orderId: order.id,
            status: "PENDING",
        });

        // Respond with order details and key
        return res.status(201).json({ order, key_id: rzp.key_id });
    } catch (err) {
        console.error('Error in purchasePremium:', err.message);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        const { order_id, payment_id } = req.body;

        const order = await Order.findOne({ where: { orderId: order_id } });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update the payment ID only
        order.paymentId = payment_id;
        await order.save();

        res.status(200).json({ message: 'Transaction status updated successfully' });
    } catch (err) {
        console.error('Error in updateTransactionStatus:', err.message);
        res.status(500).json({ error: 'Failed to update transaction status.' });
    }
};

module.exports = { purchasePremium, updateTransactionStatus };
