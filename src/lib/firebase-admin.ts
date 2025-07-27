
import admin from 'firebase-admin';
import 'server-only';

require('dotenv').config({ path: '.env' });

let adminApp: admin.app.App;

if (!admin.apps.length) {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountString) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable was not found. The application cannot initialize on the server.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.message);
    throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY or initialize Firebase Admin SDK: ${error.message}`);
  }
} else {
  adminApp = admin.app();
}

const adminDb = adminApp.firestore();
const adminAuth = adminApp.auth();

export { adminDb, adminAuth };
