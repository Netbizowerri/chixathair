# Privyr Email Notifications Setup

## What Privyr Does

When an order is successfully paid, the backend automatically sends a notification to your Privyr inbox with:
- Customer name, email, phone
- Order items and total
- Shipping address
- Payment reference

You'll receive the notification email instantly and can manage leads/orders from your Privyr dashboard.

---

## Configuration

The Privyr webhook is **already configured** in `server/index.js`. No API key needed — the webhook URL is:

```
https://www.privyr.com/api/v1/incoming-leads/0vZfjMQw/GH2rwKlg
```

This is hardcoded in the `sendPrivyrNotification()` function. If you need to change it later, edit line 27 of `server/index.js`.

---

## Data Sent to Privyr

Each notification includes:

| Field | Value |
|-------|-------|
| `first_name` | Customer's first name |
| `last_name` | Customer's last name |
| `email` | Customer email |
| `phone` | Customer phone (from shipping) |
| `message` | Full order summary (items, total, address, payment ref) |
| `source` | `"Website Checkout"` |
| `utm_*` | Campaign tracking tags |
| `custom_fields` | Structured fields: Order ID, Total, Destination, Shipping Method, Payment Reference, Items list |

---

## Testing Privyr

1. Complete a test order (use Paystack test card if available)
2. After successful payment, check your email inbox associated with Privyr
3. You should receive a nicely formatted order notification

If you don't receive it:
- Check Render logs for any `❌ Failed to send Privyr notification` errors
- Verify your Privyr account is active
- Confirm the webhook URL hasn't changed in your Privyr dashboard

---

## Customizing the Notification

To customize what data is sent, edit the `payload` object in `server/index.js` lines 32–56.

Privyr formatting options: https://www.privyr.com/api