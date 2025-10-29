# Stripe Setup Guide

## Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** and **Secret key** (use test mode for development)
3. Add them to your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

## Step 2: Create Products and Prices in Stripe

### Option 1: Using Stripe Dashboard (Easiest)

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/test/products)
2. Click **"+ Add product"**

### Create Growth Plan ($49/month)

1. Name: `Growth Plan`
2. Description: `For SMBs, e-commerce stores, and active blogs needing consistent, branded support.`
3. Pricing:
   - Pricing model: **Standard pricing**
   - Price: `49.00`
   - Billing period: **Monthly**
4. Click **"Add product"**
5. Copy the **Price ID** (starts with `price_...`)

### Create Pro Plan ($199/month)

1. Click **"+ Add product"**
2. Name: `Pro Plan`
3. Description: `SaaS, large documentation sites, & businesses with high user traffic & specific support.`
4. Pricing:
   - Price: `199.00`
   - Billing period: **Monthly**
5. Click **"Add product"**
6. Copy the **Price ID**

## Step 3: Add Price IDs to Environment Variables

Add the price IDs to your `.env` file:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...

# Stripe Webhook Secret (get after setting up webhook)
STRIPE_WEBHOOK_SECRET=whsec_...

# Product Price IDs (after creating products)
NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY_USD_PRICE_ID=price_1abc123...
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_USD_PRICE_ID=price_1xyz789...
```

## Step 4: Set Up Webhook Endpoint

### For Local Development:

#### Install Stripe CLI

The Stripe CLI allows you to test webhooks locally by forwarding Stripe events to your development server.

**Installation:**

- **macOS**: `brew install stripe/stripe-cli/stripe`
- **Linux/Windows**: See [official installation guide](https://docs.stripe.com/stripe-cli/install)

#### Authenticate Stripe CLI

1. Log in to your Stripe account:
   ```bash
   stripe login
   ```
2. Press **Enter** to open the browser and complete authentication
3. The CLI will generate restricted keys for testing

#### Forward Webhooks to Local Server

1. Make sure your Next.js dev server is running:

   ```bash
   npm run dev
   ```

2. In a **separate terminal**, start webhook forwarding:

   ```bash
   stripe listen --forward-to localhost:3000/api/subscriptions/webhook
   ```

3. The CLI will output a webhook signing secret (starts with `whsec_...`):

   ```
   > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
   ```

4. **Copy this secret** and add it to your `.env` file:

   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

5. Keep this terminal running while testing. You'll see webhook events in real-time:
   ```
   2024-01-15 10:30:45  --> checkout.session.completed [evt_xxx]
   2024-01-15 10:30:45  <-- [200] POST http://localhost:3000/api/subscriptions/webhook
   ```

#### Trigger Test Events

You can manually trigger webhook events for testing:

```bash
# Trigger checkout.session.completed event
stripe trigger checkout.session.completed

# Trigger customer.subscription.updated event
stripe trigger customer.subscription.updated

# Trigger invoice.payment_succeeded event
stripe trigger invoice.payment_succeeded

# Trigger invoice.payment_failed event
stripe trigger invoice.payment_failed

# Trigger customer.subscription.deleted event
stripe trigger customer.subscription.deleted
```

> 💡 **Tip**: Keep the `stripe listen` command running in a separate terminal while developing. This ensures webhooks are forwarded in real-time as you test subscriptions, payments, and payment methods.
