# Deploy Backend to Render.com

This guide covers deploying the Express.js payment backend to Render's free tier.

## Prerequisites

- GitHub account (or you can deploy manually via Render's web UI)
- Paystack secret key (from Paystack Dashboard → Settings → API Keys)
- Firebase service account key (JSON)

## Step 1: Create a Firebase Service Account

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

## Step 2: Push to GitHub (Optional — Recommended)

Create a new repository on GitHub and push your code:

```bash
# From project root
git init
git add .
git commit -m "Initial commit with Paystack payment backend"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

## Step 3: Deploy on Render

1. Sign up / log in to [Render](https://render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (or use manual deploy)
4. Configure the service:

   **Name:** `chixat-hair-api` (or any name)
   **Environment:** `Node`
   **Region:** Choose closest to you
   **Branch:** `main`
   **Build Command:**
   ```bash
   npm install
   ```
   **Start Command:**
   ```bash
   npm start
   ```

5. Click **"Advanced"** → Add Environment Variables:

   **Required:**
   ```
   PAYSTACK_SECRET_KEY = sk_live_your_secret_key_here
   FIREBASE_PROJECT_ID = chixathair
   FIREBASE_PRIVATE_KEY_ID = your_private_key_id_from_json
   FIREBASE_PRIVATE_KEY = your_full_private_key_with_newlines_escaped
   FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxxxx@chixathair.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID = your_client_id
   FIREBASE_CLIENT_X509_CERT_URL = https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40chixathair.iam.gserviceaccount.com
   FRONTEND_URL = https://your-frontend-domain.com
   ```

   **How to format `FIREBASE_PRIVATE_KEY`:**
   - Copy the entire private key from JSON (includes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
   - Replace actual newlines with `\n` (literal backslash-n)
   - Example: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANB ... \n-----END PRIVATE KEY-----`

6. Click **"Create Web Service"**

Render will build and deploy. Your API will be live at:
```
https://chixat-hair-api.onrender.com
```

## Step 4: Update Frontend Environment

Add your Render URL to your frontend `.env.local`:

```bash
VITE_BACKEND_URL=https://chixat-hair-api.onrender.com
```

## Step 5: Test the Payment Flow

1. Visit your site at `http://localhost:5173`
2. Add items to cart, go to checkout
3. Pay with Paystack popup (test mode works with test cards)
4. After payment, check Firestore → `orders` collection for new order

## Important Notes

- Render free tier **sleeps after 15 mins of inactivity** — first request after sleep takes ~30s to wake. This won't affect payment callbacks.
- Deploy logs show any build errors; fix and redeploy if needed.
- Paystack secret key is **server-side only** — never exposed to frontend.
- Firebase credentials are stored as **encrypted environment variables** on Render.

## Troubleshooting

**"Cannot find module 'firebase-admin'"**
→ Ensure `npm install` ran during build (check build logs)

**Firebase permission errors**
→ Verify service account has "Cloud Datastore User" role in IAM

**CORS errors**
→ Confirm `FRONTEND_URL` env var matches your site domain exactly

**Payment verification fails**
→ Double-check Paystack secret key is live (not test key), and amount matches exactly (in kobo)
