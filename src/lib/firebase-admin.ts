import admin from 'firebase-admin';
import 'server-only';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

let adminApp: admin.app.App;

if (!admin.apps.length) {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountString) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable was not found. Check your .env.local file.');
  }

  try {
    const serviceAccountJson = JSON.parse(serviceAccountString);
    
    // This is the crucial step to fix the private key format
    const privateKey = serviceAccountJson.private_key.replace(/\\n/g, '\n');

    const serviceAccount: admin.ServiceAccount = {
      projectId: serviceAccountJson.project_id,
      privateKey: privateKey,
      clientEmail: serviceAccountJson.client_email,
    };

    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

  } catch (error: any) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY or initialize Firebase Admin SDK:', error.message);
    throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY or initialize Firebase Admin SDK: ${error.message}`);
  }
} else {
  adminApp = admin.app();
}

const adminDb = admin.firestore();

export { adminDb };
