// import Stripe from "stripe";
// import Payment from "../model/PaymentModel.js";
// import User from "../model/userModel.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET);

// const PLANS = {
//   basic: { amountINR: 1999, credits: 500, months: 1 },
//   premium: { amountINR: 2999, credits: 1000, months: 1 },
//   topup: { amountINR: 500, credits: 100 },
// };

// // Checkout session (already done)
// export async function createCheckoutSession(req, res) {
//   try {
//     const { kind } = req.body;
//     const plan = PLANS[kind];
//     if (!plan) {
//       return res.status(400).json({ message: "Invalid plan selected" });
//     }

//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             unit_amount: plan.amountINR * 100,
//             product_data: { name: `Profluent ${kind}` },
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: process.env.CLIENT_URL + "/billing?success=1",
//       cancel_url: process.env.CLIENT_URL + "/billing?canceled=1",
//       metadata: { userId: req.user.id, kind },
//     });

//     await Payment.create({
//       userId: req.user.id,
//       kind: kind === "topup" ? "TOPUP" : "SUBSCRIPTION",
//       amountINR: plan.amountINR,
//       creditsGranted: plan.credits,
//       status: "pending",
//       stripeSessionId: session.id,
//     });

//     res.json({ url: session.url, message: "Redirecting to payment" });
//   } catch (err) {
//     console.error("Payment error:", err);
//     res.status(500).json({ message: "Unable to create checkout session" });
//   }
// }

// // Stripe webhook handler
// export async function handleStripeWebhook(req, res) {
//   try {
//     // TODO: Use STRIPE_WEBHOOK_SECRET for real verification
//     const event = req.body;

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;

//       const { userId, kind } = session.metadata;
//       const plan = PLANS[kind];
//       if (!plan) {
//         return res.status(400).json({ message: "Invalid plan in webhook" });
//       }

//       // 1. Update user credits & subscription
//       const user = await User.findById(userId);
//       if (user) {
//         user.credits += plan.credits;

//         // If subscription (basic/premium), set expiry date
//         if (kind !== "topup") {
//           const months = plan.months || 1;
//           const expires = new Date();
//           expires.setMonth(expires.getMonth() + months);

//           user.subscription = { tier: kind, expiresAt: expires };
//         }

//         await user.save();
//       }

//       // 2. Update payment record
//       await Payment.findOneAndUpdate(
//         { stripeSessionId: session.id },
//         { status: "succeeded" }
//       );

//       console.log(`✅ Credits added to user ${userId} (${plan.credits})`);
//     }

//     res.json({ received: true });
//   } catch (err) {
//     console.error("Webhook error:", err);
//     res.status(400).send(`Webhook Error: ${err.message}`);
//   }
// }
