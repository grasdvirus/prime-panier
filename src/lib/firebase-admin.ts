import admin from 'firebase-admin';
import 'server-only';

const serviceAccountString = process.env.SERVICE_ACCOUNT_JSON;

if (!serviceAccountString) {
  throw new Error('The SERVICE_ACCOUNT_JSON environment variable is not set. Please add it to your .env.local file.');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountString);
} catch (e) {
  console.error('Failed to parse SERVICE_ACCOUNT_JSON. Make sure it is a valid JSON string.', e);
  throw new Error('Failed to parse SERVICE_ACCOUNT_JSON. Make sure it is a valid JSON string.');
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
