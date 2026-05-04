# Cpanel Deployment Guide

## Pre-Deployment Checklist

1. **Build the frontend:**
```bash
npm run build
```
This creates the `dist/` folder with production files.

2. **Update Paystack Public Key** in `.env.local` if you haven't:
```bash
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_public_key_here
```
Then rebuild: `npm run build`

3. **Ensure your Firestore rules** allow public read access for products (already configured in Firebase Console)

---

## Upload to cPanel

### Step 1: Compress the `dist` folder

Zip the entire contents of the `dist` directory:
- Right-click `dist` → "Send to" → "Compressed (zipped) folder"
- Rename to `chixathair.zip`

### Step 2: Log into cPanel

1. Open your hosting provider's cPanel URL (usually `https://yourdomain.com:2083`)
2. Log in with your credentials

### Step 3: Upload the zip file

1. Go to **"File Manager"**
2. Navigate to `public_html` (or your subdomain folder if using subdomain like `shop.yourdomain.com`)
3. Click **"Upload"**
4. Select the `chixathair.zip` file and upload
5. Once uploaded, select the zip file and click **"Extract"**
6. Extract to `public_html` (ensure it extracts the files *inside* the zip, not a nested folder)

**Result:** You should see `index.html`, `assets/`, etc. directly in `public_html`

### Step 4: Set up the `.htaccess` file (for React Router)

If the `.htaccess` file wasn't included in the build (it's not), create it manually in `public_html`:

**File:** `public_html/.htaccess`

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options nosniff
  Header always set X-Frame-Options DENY
  Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>
```

### Step 5: Update Paystack Redirect URL

Go to Paystack Dashboard → **Payment Pages** → Edit your page:

**Redirect URL:** set to your live site:
```
https://yourdomain.com/thank-you
```

If you installed in a subdirectory (e.g., `yourdomain.com/shop`), use:
```
https://yourdomain.com/shop/thank-you
```

---

## Environment Variables on cPanel

Vite consumes env vars at **build time**. If you need to change them after building, you must rebuild and re-upload.

### Option A: Rebuild with Production Values

On your local machine, create `.env.production`:
```bash
VITE_PAYSTACK_PUBLIC_KEY=pk_live_actual_key_here
VITE_BACKEND_URL=https://your-backend.onrender.com  # if using backend
```

Then rebuild:
```bash
npm run build
```

Re-upload the new `dist/` folder.

### Option B: Use cPanel Environment Variables (if supported)

Some cPanel setups support environment variables via `.htaccess` or cPanel UI:

**Using `.htaccess`:**
```apache
SetEnv VITE_PAYSTACK_PUBLIC_KEY pk_live_your_key_here
```

**Via cPanel UI:**
- Go to **"Software"** → **"PHP INI Editor"** (for PHP apps, but Vite is static — not applicable)
- cPanel doesn't directly support environment variables for static sites; you must rebuild.

---

## Testing

1. Visit `https://yourdomain.com`
2. Browse to a product → Add to cart → Checkout
3. You should be redirected to Paystack
4. After "payment", you'll return to `/thank-you`

**Check:**
- Open browser DevTools → Network tab → verify all assets (JS, CSS, images) load with 200 status
- If 404 errors appear, the `.htaccess` may be missing or misconfigured

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| **404 on refresh** | `.htaccess` missing or incorrect. Upload the one above. |
| **CSS/JS not loading** | Ensure `dist/assets/` uploaded correctly. Check file permissions (644). |
| **Images broken** | Images use external URLs — check they're accessible. |
| **Paystack popup fails** | Ensure `VITE_PAYSTACK_PUBLIC_KEY` was set at build time. |
| **Thank you page shows blank** | Check that `/thank-you` route is accessible (React Router). |
| **CORS errors** | Not applicable for static frontend. If using backend, ensure backend allows your domain. |

---

## Optional: Deploy Backend Separately

If you later deploy the Express backend (on Render/Railway), update `.env.local`, rebuild, and re-upload `dist/`.

---

## Files to Upload

From the `dist` folder:
```
dist/
├── index.html
├── assets/
│   ├── index-XXXXX.js
│   └── index-XXXXX.css
```

Do NOT upload `dist/*.map` files (source maps) unless needed for debugging.

---

**After deployment, your site is live at:** `https://yourdomain.com`
