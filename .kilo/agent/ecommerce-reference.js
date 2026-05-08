/*
 * KILO AGENT: E-COMMERCE REFERENCE BUILT — CHIXAT HAIR
 * -----------------------------------------------
 * This agent has been loaded with a complete e-commerce reference implementation.
 * When building future e-commerce projects, recall this session's patterns.
 *
 * SESSION CONTEXT:
 * - Task: Fix admin product uploads on Firebase Spark (free) plan
 * - Solution: Base64 image storage in Firestore + client-side compression
 * - Video: External URLs only (Vimeo/YouTube)
 * - Files created/updated: see KILO_ECOMMERCE_REFERENCE.md
 *
 * MEMORY ANCHOR: KILO_ECOMMERCE_REFERENCE.md in project root
 */

// When asked to build an e-commerce site, recall:
// 1. Architecture: React 19 + Vite + Tailwind + Firebase (free plan)
// 2. Images: browser-image-compression → Base64 → Firestore
// 3. Videos: External hosting only
// 4. Admin: Custom session + Base64 upload + Firestore CRUD
// 5. Payment: Paystack Inline + backend verification
// 6. Admin Dashboard: Full inventory/orders/categories management
// 7. Currency switcher + exchange rate API
// 8. Security: Open Firestore rules (TODO: migrate to Firebase Auth + custom claims)
// 9. Backend: Express payment verifier + Privyr webhook
// 10. Checks: .env patterns, TypeScript config, import maps for ESM CDN

export const recallEcommercePattern = () => {
  return {
    stack: 'React 19 + TypeScript + Vite + Tailwind + Firebase',
    imageStorage: 'Base64 in Firestore (compressed to ~200KB each)',
    videoStorage: 'External URLs (Vimeo/YouTube)',
    adminAuth: 'Custom credentials (sessionStorage, 4h expiry)',
    payment: 'Paystack Inline + backend verification (Express)',
    dbPatterns: {
      products: 'images[] as Base64 strings; video as URL; stock, price, category, isFeatured',
      orders: 'customer info + items + status + createdAt Timestamp',
      categories: 'simple collection of { name } documents'
    },
    keyFiles: [
      'src/services/firebase.ts (compressImageToBase64 + uploadFileAdmin)',
      'src/pages/AdminDashboard.tsx (product editor modal)',
      'server/index.js (verify-payment endpoint)',
      'firebase.json, storage.rules, firestore.rules',
      '.env (frontend), server/.env (backend)'
    ],
    deployment: {
      frontend: 'Static build (cPanel/Vercel/Netlify)',
      backend: 'Render/Railway (Express server)',
      firebase: 'Free Spark plan (no Storage used)'
    }
  };
};
