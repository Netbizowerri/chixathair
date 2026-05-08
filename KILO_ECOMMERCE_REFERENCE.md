# Chixat Hair E-Commerce Reference Architecture

## Project Overview

**Name:** Chixat Hair DB  
**Domain:** Premium hair extensions & wigs e-commerce (Luxury positioning)  
**Stack:** React 19 + TypeScript + Vite (frontend), Node.js + Express (backend), Firebase (BaaS)  
**Auth Model:** Custom admin credentials (sessionStorage) + Paystack payments + optional Firebase Customer Auth (future)

---

## 1. FRONTEND ARCHITECTURE

### Framework & Tooling
- **React 19** with functional components + hooks
- **TypeScript** strict typing (loose: `any` used in some Firebase operations)
- **Vite 6.2.0** as build tool & dev server
- **Tailwind CSS 4.x** via CDN (no build-time CSS)
- **React Router DOM v7** for SPA routing
- **ES Modules** throughout — import maps define external dependencies from ESM.sh CDN

### Dependencies (key)
```json
{
  "firebase": "^12.9.0",         // Firebase SDK v12 modular
  "react-paystack": "^6.0.0",    // Paystack popup integration
  "lucide-react": "0.474.0",      // Icon library
  "@google/genai": "1.3.0",       // Gemini AI (AI consultant feature)
  "browser-image-compression": "^2.0.2"  // Client-side image compression
}
```

### Asset Delivery Strategy
**Images:** Base64 data URLs (compressed) stored directly in Firestore documents  
**Videos:** External URLs only (Vimeo/YouTube embed) — no hosting  
**Rationale:** Firebase Spark (free) plan limitations — Storage not available; Firestore 1MB document limit respected via compression

### Compression Strategy
- Max 200KB per image (via `browser-image-compression`)
- Max dimensions: 800px width/height
- Up to 3 images per product
- Fallback: if compression fails, use raw Base64 (may exceed limits)

### Routing Structure
```
/                    → Home page (hero slider + featured products)
/shop                → Product grid (category filtering + sorting)
/product/:id         → Single product detail (gallery + video + add-to-cart)
/cart                → Shopping cart review
/checkout            → Multi-step checkout + Paystack
/thank-you           → Order confirmation
/contact             → Contact form
/about-us            → Brand story
/faq                 → FAQ page
/returns-policy      → Returns info
/adminlogin          → Admin login (custom credentials)
/admin/dashboard     → Protected admin panel (CRUD: products, orders, categories)
/admin/dashboard?tab=orders → Order management
```

### Layout & Styling
- **Font:** Poppins (Google Fonts), 10 weights
- **Color Brand:** `#ae7a27` (gold/bronze) — `brand`, `brand-light`, `brand-dark`, `brand-soft`
- **Theme:** Minimal luxury (black/white + brand accent)
- **Animations:** Custom CSS keyframes (`animate-assemble`, `animate-disintegrate`, `animate-float`)
- **Responsive:** Mobile-first, Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)
- **Scroll behavior:** smooth with custom scrollbar styling

---

## 2. STATE MANAGEMENT

**Pattern:** Lifting state up to `App.tsx` (no Redux/Zustand)

### Top-level State in `App.tsx`
```typescript
products: Product[]              // Catalog from Firestore
cart: CartItem[]                 // Session cart (persisted to localStorage?)
categories: string[]             // Category list
currency: { code, rate, symbol } // Currency context
isCartOpen: boolean              // Drawer state
checkoutStep: number             // Checkout wizard steps
orderComplete: boolean           // Post-payment flag
refetchProducts: () => void      // Callback to reload products
```

### Data Fetching
- Products: `getProducts()` in `firebase.ts` → `getDocs(collection('products'))`
- Categories: `getCategories()` → `getDocs(collection('categories'))`
- Orders: `getOrders()` with `orderBy('createdAt', 'desc')`
- Product detail: `useParams()` + lookup in products array

### Cart
- In-memory state + `localStorage` persistence (via `useEffect`)
- Quantity adjustments, remove items, clear on order completion

---

## 3. FIREBASE INTEGRATION

### Configuration
- **Project ID:** `chixathair`
- **Storage Bucket:** `chixathair.firebasestorage.app` (not used for uploads)
- **Firestore Collections:**
  - `products` — document schema:
    ```typescript
    {
      id: string,
      name: string,
      price: number,
      description: string,
      category: string,
      images: string[],         // BASE64 data URLs
      video?: string,           // External URL (Vimeo/Youtube)
      stock: number,
      isFeatured?: boolean,
      createdAt?: Timestamp
    }
    ```
  - `orders` — document schema:
    ```typescript
    {
      id: string,
      customerName: string,
      email: string,
      items: CartItem[],
      totalAmount: number,
      shippingInfo: { destination, shippingRate, shippingLabel, address, phone },
      paymentReference: string,
      paymentMethod: 'paystack',
      status: 'Pending'|'Processing'|'Shipped'|'Delivered'|'Paid',
      createdAt: Timestamp
    }
    ```
  - `categories` — collection of `{ name: string }` documents

### Security Rules Status
**Current:** Permissive (open writes — admin panel uses client SDK without auth)  
**Planned:** Migrate to Firebase Auth + custom admin claims

- `firestore.rules` — documents future admin-only writes (currently `allow write: if true`)
- `storage.rules` — explicitly disabled (`allow write: if false`) — images stored in Firestore, not Storage

---

## 4. ADMIN SYSTEM

### Authentication Flow
**Custom credential-based** (NOT Firebase Auth):
```typescript
// Env vars
VITE_MASTER_ID = "Chixathairbyedna@gmail.com"
VITE_ELITE_KEY = "Chixat.1033"

// Session
sessionStorage.setItem('artisan_session', base64({ role: 'Artisan', exp: 4h }))
// Expiry: 4 hours; checked via decode + exp comparison on protected route
```

### Admin Dashboard Features (`AdminDashboard.tsx`)
1. **Dashboard Tab** — KPIs:
   - Total revenue (`orders.reduce`)
   - Total products count
   - Pending/Delivered orders
   - Low stock alerts (< 5 units)
   - Category breakdown chart (bar visualization)
   - Recent orders list (last 5)

2. **Inventory Tab** — Product CRUD:
   - Table with name, category, stock status
   - Edit/Delete actions per row
   - Search input (frontend filter only, not connected)
   - **Product Editor Modal**:
     - Name, category (select + create/delete), price, description
     - Stock quantity, featured toggle
     - 3× image upload (Base64 via `uploadFileAdmin()`)
     - Video (external URL input)
     - Image preview + remove (× button)
     - Save (calls `saveProduct()` → Firestore `setDoc`/`addDoc`)

3. **Orders Tab** — Order management:
   - Table with ref, customer, status, amount
   - Status dropdown (Pending → Processing → Shipped → Delivered)
   - Update via `updateOrderStatus()`

4. **Category Management** (in modal):
   - Create new category (`addDoc('categories', { name })`)
   - Delete category (protects default "Affordable Hairs")

### Data Seeding
`seedDatabase(INITIAL_PRODUCTS)` — populates hardcoded products from `data.ts` (20+ wig entries)

---

## 5. BACKEND ARCHITECTURE

### Express Server (`server/index.js`)

**Purpose:** Payment verification + order creation (secure, server-side)

**Endpoints:**
```http
POST /api/verify-payment   // Paystack verification + Firestore order creation
GET  /api/health           // Health check
```

**Key Middleware:**
- CORS — `origin: process.env.FRONTEND_URL` (default `http://localhost:5173`)
- `express.json()` — no size limit set (default 100kb would be insufficient; not needed after Base64 switch)

**Firebase Admin:**
- Initialized with service account credentials from env vars
- Used for: Firestore orders write, Privyr webhook notification

**Paystack Flow:**
```
Client → Paystack Popup → Success → Frontend calls backend /api/verify-payment
      → Backend verifies tx via Paystack API → Creates order in Firestore (admin SDK)
      → Sends Privyr webhook (async) → Responds to client → Redirect to thank-you
```

### Environment Variables (server/.env)
```bash
PAYSTACK_SECRET_KEY=sk_live_...
FIREBASE_PROJECT_ID=chixathair
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
FIREBASE_CLIENT_X509_CERT_URL=...
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Note:** No Admin Upload Secret required anymore — Base64 bypasses need for backend upload endpoint

### Deployment Options
- Render.com (recommended)
- Railway, Fly.io, Heroku alternative
- `npm start` runs `node index.js`

---

## 6. PAYMENT INTEGRATION

### Paystack Inline Popup (`react-paystack`)
- Public key in frontend env: `VITE_PAYSTACK_PUBLIC_KEY`
- Transaction reference passed to backend for verification
- Amount checked against order total (kobo → Naira conversion)

### Checkout Flow (`Checkout.tsx`)
1. Multi-step form (Shipping → Review → Payment)
2. Shipping zones with rates (Lagos/Abuja/Urban/Suburban/Rural)
3. Paystack popup opens with amount + email + reference
4. On success: POST `/api/verify-payment` with orderData
5. Backend verifies → creates order → responds
6. Frontend redirects to `/thank-you`

### Privyr Integration (Optional)
- Webhook sends new order details to Privyr CRM
- Non-blocking `try/catch` in backend
- URL hardcoded: `https://www.privyr.com/api/v1/incoming-leads/...`

---

## 7. MEDIA HANDLING (BASE64 STRATEGY)

### Rationale
- Firebase Storage requires Blaze (paid) plan — not available on Spark (free) tier
- Solution: Compress images client-side + store as Base64 in Firestore

### Implementation
```typescript
// services/firebase.ts
import imageCompression from 'browser-image-compression';

export const compressImageToBase64 = async (file: File) => {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.2,       // ~200KB
    maxWidthOrHeight: 800,
    useWebWorker: true
  });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(compressed);
  });
};

// Admin upload calls this → returns base64 string → saved in images[]
```

### Document Size Management
- 3 images × 200KB = ~600KB < 1MB Firestore limit (safe)
- Video not stored — only external URLs

---

## 8. CONFIGURATION & ENV

### Frontend `.env`
```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=chixathair
VITE_FIREBASE_STORAGE_BUCKET=chixathair.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_MASTER_ID=Chixathairbyedna@gmail.com
VITE_ELITE_KEY=Chixat.1033
VITE_EXCHANGE_RATE_API_KEY=...  # For currency conversion
VITE_PAYSTACK_PUBLIC_KEY=pk_live_...
```

### Backend `server/.env`
```bash
PAYSTACK_SECRET_KEY=sk_live_...
FIREBASE_PROJECT_ID=chixathair
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
FIREBASE_CLIENT_X509_CERT_URL=...
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Firebase Config Files
- `firebase.json` — minimal; includes `"functions": {"source": "functions"}` + storage/firestore rule refs
- `storage.rules` — write disabled (Base64 approach)
- `firestore.rules` — permissive writes (TODO: tighten with Firebase Auth)
- `firestore.indexes.json` — placeholder (no composite indexes used)

---

## 9. DATA FLOW DIAGRAMS

### Order Creation (Secure Path)
```
Frontend (Checkout)
  ↓ POST /api/verify-payment {reference, orderData}
Backend (Express)
  ↓ Verify tx via Paystack API (Bearer sk_live_...)
  ↓ Validate amount match
  ↓ Initialize Firebase Admin SDK
  ↓ db.collection('orders').add({...})
  ↓ sendPrivyrNotification() async
  ↓ Respond { success: true, orderId }
Frontend
  ↓ navigate('/thank-you')
```

### Admin Product Upload (Base64)
```
Admin (authenticated via sessionStorage)
  ↓ Opens "Add Product" modal
  ↓ Selects 3 image files
  ↓ uploadFileAdmin(file) in services/firebase.ts
  ↓ browser-image-compression → Base64 string
  ↓ store in editingProduct.images[]
  ↓ Submit form → saveProduct(product)
  ↓ Firestore addDoc/updateDoc writes Base64 strings directly
  ↓ No server involved (client SDK)
```

---

## 10. SECURITY NOTES & GAPS

| Area | Status | Recommendation |
|------|--------|----------------|
| Admin auth | Custom base64 session | Migrate to Firebase Auth + custom claims |
| Firestore writes | Open (client SDK) | Backend API layer for all writes or enable rules with Auth |
| Order creation | Backend only (secure) | ✅ Good |
| Paystack verification | Backend only (secure) | ✅ Good |
| Image uploads | Client-side (Base64) | ✅ Acceptable on Spark plan; monitor Firestore size |
| Video files | External URLs only | ✅ Good |
| CORS | `http://localhost:5173` | Update for production domain |
| Rate limiting | None | Add for `/api/verify-payment` |

---

## 11. DEPLOYMENT CHECKLIST

### Firebase
- Deploy Firestore rules: `firebase deploy --only firestore`
- (Optional) Deploy Storage rules: `firebase deploy --only storage`
- No Functions/Storage hosting used

### Backend (Render, Railway, etc.)
- Set env vars: `PAYSTACK_SECRET_KEY`, `FIREBASE_*` (service account), `FRONTEND_URL`
- Deploy `server/index.js`
- Health check: `GET /api/health`

### Frontend (cPanel, Vercel, Netlify)
- Build: `npm run build`
- Serve `dist/` folder
- Set env vars (or embed via build)
- Configure Paystack public key

### Environment Files
- `.env` (root) → frontend build-time variables
- `server/.env` → backend runtime variables
- Ensure `.gitignore` blocks both

---

## 12. PERFORMANCE & COST OPTIMIZATIONS

- **Image compression** reduces Firestore storage costs (~200KB vs 2MB+ raw)
- **No Firebase Storage** → avoids $0.026/GB/month
- **One-time Firestore reads** for product lists (not real-time listeners on shop)
- **Pagination** not yet implemented (catalog ~100 products OK now)
- **Lazy loading** images via `loading="lazy"` on ProductDetail gallery
- **CDN** for static assets (Firebase Hosting or cPanel S3-like)

---

## 13. FUTURE ROADMAP

- [ ] Migrate admin auth to Firebase Auth with custom `admin` claim
- [ ] Tighten Firestore rules (`allow write: if request.auth.token.admin == true`)
- [ ] Move product/image writes to backend Cloud Function (admin-only)
- [ ] Add pagination to shop & admin inventory
- [ ] Image CDN (Cloudinary) if Firestore Base60 strategy hits limits
- [ ] Customer accounts (Firebase Auth) + wishlist + order history
- [ ] Admin audit log (track changes via Cloud Functions)
- [ ] Proper video hosting: Cloudinary or Mux (if not using external URLs)

---

## 14. FILE LOCATION REFERENCE

```
/src
  /pages
    AdminDashboard.tsx      → Admin UI (products, orders, categories)
    AdminLogin.tsx          → Admin login form
    Home.tsx                → Hero slider + featured grid
    Shop.tsx                → Product listing + filters
    ProductDetail.tsx       → Single product + gallery + video
    Cart.tsx                → Cart review
    Checkout.tsx            → Multi-step checkout
    ThankYou.tsx            → Order success
  /services
    firebase.ts             → Firebase client SDK + compression + upload function
    geminiService.ts        → AI consultant (Gemini)
  /context
    currency.tsx            → Currency switcher context
  /components
    Layout.tsx              → Site shell + nav
    SEO.tsx                 → Meta tags
    CurrencySwitcher.tsx    → Currency selector
    ScrollToTop.tsx         → SPA navigation fix
  types.ts                  → TypeScript interfaces
  data.ts                   → INITIAL_PRODUCTS seed (20 items)
  App.tsx                   → Routes + global state
  index.tsx                 → Entry point

/server
  index.js                  → Express server (Paystack verify + Privyr webhook)
  .env.example              → Backend env template
  README.md                 → Server setup instructions

/functions                  → Firebase Cloud Functions folder (empty/reserved)
/public                     → Static assets (icons, images)

config files:
  firebase.json             → Firebase CLI config (functions + rules refs)
  storage.rules             → Security rules (writes disabled)
  firestore.rules           → Security rules (open → TODO: restrict)
  firestore.indexes.json    → Index config (empty)
  vite.config.ts            → Vite + TS path alias
  .env                      → Frontend env vars
  .gitignore                → Excludes .env, node_modules, dist
  package.json              → Root deps
  tsconfig.json             → TS config (ES2022, React JSX)
  index.html                → HTML shell + Tailwind + import map

Docs:
  README.md
  DEPLOYMENT_SUMMARY.md
  CPANEL_DEPLOY.md
  PAYSTACK_INTEGRATION_TEST.md
  server/README.md
  server/PRIVYR_SETUP.md
```

---

## 15. KILO SKILL APPLICATION SUMMARY

This project demonstrates **all applied skills**:

| Skill | Application |
|-------|-------------|
| **frontend-architect** | React 19 + Vite + Tailwind; component structure; routing; responsive design; state lifting pattern |
| **backend-engineer** | Express REST API (`/api/verify-payment`); validation; error handling; service separation |
| **firebase-expert** | Firestore collections & queries; Security Rules; Admin SDK on backend; Spark plan limitations → Base64 storage |
| **web-security-specialist** | CORS configuration; environment secret handling; backend verification (Paystack); session auth for admin (note: custom → needs Firebase Auth migration) |
| **qa-specialist** | Import testing across components; err handling in uploads & payment; error fallbacks in data fetching |

---

**Last updated:** 2026-05-08  
**Build commit reference:** This document describes the state after admin Base64 image upload fix (post-Firebase-Expert skill application)
