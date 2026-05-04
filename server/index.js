import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize Firebase Admin
let firebaseInitialized = false;

const initializeFirebase = () => {
  if (firebaseInitialized) return;

  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  firebaseInitialized = true;
  console.log('✅ Firebase Admin initialized');
};

// Verify Paystack payment and create order
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { reference, orderData } = req.body;

    if (!reference || !orderData) {
      return res.status(400).json({ error: 'Reference and orderData are required' });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Paystack secret key not configured');
    }

    // Verify with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
    });

    const result = await response.json();

    if (!result.status || result.status !== true) {
      return res.status(400).json({ error: 'Paystack verification failed' });
    }

    const transaction = result.data;
    if (transaction.status !== 'success') {
      return res.status(400).json({ error: 'Payment was not successful' });
    }

    // Amount verification: Paystack uses kobo (multiply by 100)
    const paidAmount = transaction.amount / 100;
    if (paidAmount !== orderData.totalAmount) {
      return res.status(400).json({
        error: `Amount mismatch: expected ${orderData.totalAmount}, received ${paidAmount}`
      });
    }

    // Initialize Firebase and create order
    initializeFirebase();

    const order = {
      customerName: orderData.customerName,
      email: orderData.email,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      shippingInfo: orderData.shippingInfo || {},
      paymentReference: reference,
      paymentMethod: 'paystack',
      status: 'Paid',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const db = admin.firestore();
    const docRef = await db.collection('orders').add(order);

    console.log(`✅ Order created: ${docRef.id}`);

    res.json({
      success: true,
      orderId: docRef.id,
      message: 'Payment verified and order created successfully'
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
