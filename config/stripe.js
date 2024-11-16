// config/stripe.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;


//add a key to the env: STRIPE_SECRET_KEY=stripe_secret_key