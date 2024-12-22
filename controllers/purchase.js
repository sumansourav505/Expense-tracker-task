const Razorpay = require('razorpay');
const Order = require('../models/order');

const purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            await req.user.createOrder({
                orderid: order.id,
                status: "PENDING",
            });
            return res.status(201).json({ order, key_id: rzp.key_id });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { purchasePremium };
