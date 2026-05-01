const router = require('express').Router();
const express = require('express');
const c = require('../../controllers/payment.controller');
const { verifyJWT, authorise } = require('../../middleware/auth');
const { checkoutLimiter } = require('../../middleware/rateLimiter');

// Stripe webhook needs raw body
router.post('/webhook', express.raw({ type: 'application/json' }), c.handleWebhook);

router.use(verifyJWT);
router.post('/checkout', checkoutLimiter, authorise('student'), c.createCheckout);
router.get('/verify/:sessionId', c.verifyPayment);
router.get('/orders/me', c.getMyOrders);

// Admin
router.get('/orders', authorise('admin'), c.listOrders);
router.post('/orders/:id/refund', authorise('admin'), c.refundOrder);
router.get('/revenue', authorise('admin'), c.getRevenue);
router.get('/instructor-revenue', authorise('instructor'), c.getInstructorRevenue);

module.exports = router;
