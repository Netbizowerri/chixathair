# Deploy Backend to Render.com

This guide covers deploying the Express.js payment backend to Render's free tier.

## Prerequisites

- GitHub account (or you can deploy manually via Render's web UI)
- Paystack secret key (from Paystack Dashboard → Settings → API Keys)
- Firebase service account key (JSON)

## Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/) → Project Settings → **Service Accounts**
2. Click **"Generate new private key"**
3. Save the JSON file securely — you'll extract fields from it

You need these fields:
- `project_id`
- `private_key_id`
- `private_key`
- `client_email`
- `client_id`
- `client_x509_cert_url`

## Step 2: Deploy on Render

1. Sign up / log in to [Render](https://render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Netbizowerri/chixathair`
4. Configure the service:

   **Name:** `chixat-hair-api`
   **Environment:** `Node`
   **Region:** Choose closest to Nigeria (Lagos/Frankfurt)
   **Branch:** `main`
   **Root Directory:** `server` ← IMPORTANT
   **Build Command:** `npm install`
   **Start Command:** `npm start`

5. Add Environment Variables (see table below)
6. Click **"Create Web Service"**

## Step 3: Environment Variables

Add these in Render dashboard:

| Variable | Value |
|----------|-------|
| `PAYSTACK_SECRET_KEY` | Your Paystack **Secret Key** (starts with `sk_live_` or `sk_test_`) |
| `FIREBASE_PROJECT_ID` | `chixathair` |
| `FIREBASE_PRIVATE_KEY_ID` | From service account JSON |
| `FIREBASE_PRIVATE_KEY` | Full private key (replace newlines with `\n`) |
| `FIREBASE_CLIENT_EMAIL` | From service account JSON |
| `FIREBASE_CLIENT_ID` | From service account JSON |
| `FIREBASE_CLIENT_X509_CERT_URL` | From service account JSON |
| `FRONTEND_URL` | Your frontend URL (e.g., `https://yourdomain.com`) |
| `NODE_ENV` | `production` |

## Step 4: Update Frontend `.env.local`

After Render deploys, update your frontend `.env.local`:

```bash
VITE_BACKEND_URL=https://chixat-hair-api.onrender.com
```

**Note:** Paystack public key is not required for Payment Page redirects.

## Step 5: Test the Payment Flow

1. Visit your site at `https://yourdomain.com`
2. Add items to cart → Checkout → Pay with Paystack
3. After payment, you'll be redirected to `/thank-you`
4. Check:
   - Firestore → `orders` collection (new order should appear)
   - Privyr inbox (order notification sent automatically)

## How It Works

- Frontend redirects to Paystack hosted payment page
- Paystack calls your backend `/api/verify-payment` (via frontend fetch after success)
- Backend verifies payment with Paystack, creates order in Firestore, sends notification to Privyr
- Customer sees thank-you page with payment reference

## Troubleshooting

**Build fails with "vite not found"**
→ Ensure Root Directory is set to `server` in Render settings

**Payment verification fails**
→ Check Paystack secret key is correct (live vs test mode)

**Firebase permission errors**
→ Verify service account has "Cloud Datastore User" role

**Privyr notifications not arriving**
→ Check Render logs for Privyr API errors; ensure webhook URL is correct
