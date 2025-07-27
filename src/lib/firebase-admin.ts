import admin from 'firebase-admin';
import 'server-only';

// Check if the app is already initialized
if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
      throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable was not found.');
    }
    
    // Parse the stringified service account key
    const serviceAccount = JSON.parse(serviceAccountString);
    // Replace escaped newlines in private_key for Vercel env vars
    if (typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // You might want to throw the error in a real-world scenario
    // or handle it gracefully depending on your application's needs.
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
