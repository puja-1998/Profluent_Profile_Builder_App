// import express from 'express';
// import { requireAuth } from '../middleware/auth.js'
// import { createCheckoutSession, handleStripeWebhook } from '../controller/paymentsController.js';

// const paymentRoutes = express.Router();

// paymentRoutes.post("/checkout", requireAuth, createCheckoutSession);
// // Stripe webhook (no auth! Stripe calls this directly)
// paymentRoutes.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

// export default paymentRoutes;