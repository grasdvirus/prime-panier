
import admin from 'firebase-admin';
import 'server-only';

let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
      throw new Error('La variable d\'environnement FIREBASE_SERVICE_ACCOUNT_KEY n\'a pas été trouvée.');
    }
    const serviceAccount = JSON.parse(serviceAccountString);
    // Replace escaped newlines in private_key for Vercel env vars
    if (typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    adminDb = admin.firestore();
    adminAuth = admin.auth();

  } catch (error: any) {
    console.error('Erreur d\'initialisation de Firebase Admin SDK:', error.message);
    // @ts-ignore
    adminDb = {};
    // @ts-ignore
    adminAuth = {};
  }
} else {
  adminDb = admin.firestore();
  adminAuth = admin.auth();
}

export { adminDb, adminAuth };
