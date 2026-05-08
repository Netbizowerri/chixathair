# E-Commerce Reference Recall Command

**Trigger:** `/recall-ecommerce` or when user requests "e-commerce best practices" or similar

**Purpose:** Load the Chixat Hair e-commerce reference architecture into context for building new e-commerce projects

**Context File:** `.kilo/agent/ecommerce-reference.js`

**Usage Guide:**

When working on e-commerce projects in the future, this command will load:

1. Architecture decisions (React 19 + Vite + Tailwind + Firebase free plan)
2. Media strategy (Base64 in Firestore, external video)
3. Admin pattern (custom auth → Base64 upload)
4. Payment integration (Paystack backend verification)
5. File locations and code patterns
6. Deployment checklist

**Invocation:**
```
/recall-ecommerce
```

**Expected Output:**
- Summarized key patterns
- Reference to `KILO_ECOMMERCE_REFERENCE.md` full details
- Suggestions for applying patterns to current project

**Tags:** #ecommerce #firebase #base64 #react19
