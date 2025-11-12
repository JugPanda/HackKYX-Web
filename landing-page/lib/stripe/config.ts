import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-10-29.clover",
    });
  }
  return stripeInstance;
};

export const TIER_INFO = {
  free: {
    name: "Free",
    price: 0,
  },
  pro: {
    name: "Pro",
    price: 5,
  },
  premium: {
    name: "Premium",
    price: 15,
  },
};
