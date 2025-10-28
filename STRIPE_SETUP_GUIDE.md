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

### Option 2: Using Stripe CLI (For Development)

If you have Stripe CLI installed:

```bash
# Install Stripe CLI (if not installed)
# macOS: brew install stripe/stripe-cli/stripe
# Linux: See https://stripe.com/docs/stripe-cli

# Create Growth Plan
stripe products create \
  --name="Growth Plan" \
  --description="For SMBs, e-commerce stores, and active blogs needing consistent, branded support."

stripe prices create \
  --unit-amount=4900 \
  --currency=usd \
  --recurring[interval]=month \
  --product=[PRODUCT_ID]

# Create Pro Plan
stripe products create \
  --name="Pro Plan" \
  --description="SaaS, large documentation sites, & businesses with high user traffic & specific support."

stripe prices create \
  --unit-amount=19900 \
  --currency=usd \
  --recurring[interval]=month \
  --product=[PRODUCT_ID]
```

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

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local:
   ```bash
   stripe listen --forward-to localhost:3000/api/subscriptions/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_...`) to your `.env`

### For Production:

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. Endpoint URL: `https://yourdomain.com/api/subscriptions/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Click **"Reveal"** to copy the signing secret to your `.env`

## Step 5: Run Database Migration

```bash
# Start your database (if using Docker)
docker compose up -d

# Run the migration
npm run db:migrate

# Generate Prisma client with new schema
npm run db:generate
```

## Step 6: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Go to `/pricing`
3. Click "Get Started" on Growth or Pro plan
4. Use test card: `4242 4242 4242 4242`

   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

5. After successful payment, go to `/billing` to see your subscription

## Test Cards

- ✅ Success: `4242 4242 4242 4242`
- ❌ Decline: `4000 0000 0000 0002`
- 🔒 3D Secure: `4000 0027 6000 3184`
- 💰 Requires Authentication: `4000 0025 0000 3155`

## Verification Checklist

- [ ] Products created in Stripe Dashboard
- [ ] Price IDs added to `.env` file
- [ ] Webhook endpoint configured
- [ ] Webhook secret added to `.env`
- [ ] Database migration completed
- [ ] Can create checkout session on pricing page
- [ ] Can see subscription on billing page

## Troubleshooting

### Products Not Showing

- Verify price IDs in `.env` match your Stripe Dashboard
- Make sure products are in the same Stripe account (test vs live)

### Webhook Not Working

- Check webhook signing secret is correct
- Verify webhook URL is accessible
- Check Stripe Dashboard → Webhooks for error messages

### Subscription Not Updating

- Check webhook events are being received
- Verify webhook handler is processing events correctly
- Check database for subscription records
