
import admin from 'firebase-admin';
import 'server-only';
import 'dotenv/config';

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set or empty.');
    }
    
    const serviceAccount = JSON.parse(serviceAccountString);
    // Replace escaped newlines in private_key for Vercel env vars
    if (typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    // Ne pas jeter d'erreur ici pour permettre au build de continuer si possible,
    // mais loguer l'erreur est crucial.
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
