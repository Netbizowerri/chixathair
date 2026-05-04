const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

/**
 * Verifies Paystack payment and creates an order.
 * Expects: { reference, orderData: { customerName, email, items, totalAmount, shippingInfo } }
 */
exports.verifyAndCreateOrder = functions.https.onCall(async (data, context) => {
  const { reference, orderData } = data;

  if (!reference || !orderData) {
    throw new functions.https.HttpsError('invalid-argument', 'Reference and orderData are required');
  }

  const secretKey = functions.config().paystack?.secret_key;
  if (!secretKey) {
    throw new functions.https.HttpsError('internal', 'Paystack secret key not configured on server');
  }

  // Verify with Paystack
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`
    }
  });

  const result = await response.json();

  if (!result.status || result.status !== true) {
    throw new functions.https.HttpsError('unknown', 'Paystack verification failed');
  }

  const transaction = result.data;
  if (transaction.status !== 'success') {
    throw new functions.https.HttpsError('failed-precondition', 'Payment was not successful');
  }

  // Basic amount verification: Paystack amount is in kobo (NGN * 100)
  const paidAmount = transaction.amount / 100;
  if (paidAmount !== orderData.totalAmount) {
    throw new functions.https.HttpsError('invalid-argument', `Amount mismatch: expected ${orderData.totalAmount}, received ${paidAmount}`);
  }

  // Create order in Firestore
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

  const docRef = await admin.firestore().collection('orders').add(order);

  return { orderId: docRef.id, success: true };
});
