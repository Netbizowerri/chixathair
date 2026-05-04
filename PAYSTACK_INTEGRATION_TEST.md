# Paystack Integration Test Guide

## What Was Fixed

The issue was that the Paystack public key was missing or invalid in the production build. The frontend now:

1. ✅ Uses `react-paystack` for inline popup (no redirect)
2. ✅ Pre-fills customer email, name, and phone from form state
3. ✅ Saves order to Firestore on payment success
4. ✅ Redirects to `/thank-you` with payment reference

## Files Modified

- `package.json` — Added `react-paystack` dependency
- `pages/Checkout.tsx` — Integrated Paystack popup with pre-filled data
- `.env.local` — Contains `VITE_PAYSTACK_PUBLIC_KEY`
- `dist/` — Fresh production build with Paystack integration

## How to Test

### Local Testing
```bash
npm run dev
```
1. Visit http://localhost:5173
2. Add product to cart
3. Go to checkout
4. Fill form (use test email/phone)
5. Click "Pay"
6. Paystack popup should open with pre-filled data
7. Use test card: `4242 4242 4242 4242`
8. After payment, check Firestore for new order

### Production Testing (cPanel)
1. Rebuild: `npm run build`
2. Upload `dist/` folder to `public_html/` via cPanel File Manager
3. Ensure `.htaccess` is present in `public_html/`
4. Visit https://chixathair.com
5. Test payment flow

## Paystack Test Cards

Use these in test mode:
- **Success**: `4242 4242 4242 4242`
- **Authentication Required**: `4000 0027 6000 3184`
- **Insufficient Funds**: `4000 0000 0000 9995`

## Verification Checklist

- [ ] `VITE_PAYSTACK_PUBLIC_KEY` is set in `.env.local`
- [ ] `npm run build` completes without errors
- [ ] `dist/assets/*.js` contains "paystack" references
- [ ] `.htaccess` is uploaded to `public_html/`
- [ ] Paystack popup opens on checkout
- [ ] Customer data is pre-filled in popup
- [ ] Order appears in Firestore after payment
- [ ] Thank-you page shows payment reference

## Troubleshooting

**Popup doesn't open:**
- Check browser console for errors
- Verify `VITE_PAYSTACK_PUBLIC_KEY` is correct
- Ensure Paystack script loaded (check Network tab)

**Payment succeeds but no order in Firestore:**
- Check browser console for Firestore errors
- Verify Firebase config in `services/firebase.ts`
- Check Firestore rules allow writes

**Blank page after payment:**
- Check if `/thank-you` route is accessible
- Verify React Router is working
- Check browser console for errors

## Support

If issues persist:
1. Check browser DevTools (F12) → Console tab
2. Check Network tab for failed requests
3. Verify all environment variables are set
4. Rebuild and re-upload `dist/` folder
