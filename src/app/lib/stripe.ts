import Stripe from "stripe";
import config from "../config";

let client: Stripe | null = null;

export const getStripe = (): Stripe => {
	if (!config.stripe_secret_key) {
		throw new Error("STRIPE_SECRET_KEY is not configured");
	}
	client ??= new Stripe(config.stripe_secret_key);
	return client;
};