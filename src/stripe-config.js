import { loadStripe } from '@stripe/stripe-js';

// Use publishable key from env (Vite) to avoid committing secrets.
// Set VITE_STRIPE_PUBLISHABLE_KEY in your .env file (e.g. .env.local)
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = loadStripe(publishableKey);

export { stripePromise };
