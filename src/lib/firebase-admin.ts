
import admin from 'firebase-admin';
import 'server-only';

let adminApp: admin.app.App;

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('The FIREBASE_PRIVATE_KEY environment variable was not found.');
  }

  const serviceAccount: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: privateKey.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  try {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.message);
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
} else {
  adminApp = admin.app();
}

const adminDb = adminApp.firestore();
const adminAuth = adminApp.auth();

export { adminDb, adminAuth };
