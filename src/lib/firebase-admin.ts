import admin from 'firebase-admin';
import 'server-only';

// This configuration is for server-side operations.

// When deployed to a Google Cloud environment (like Firebase App Hosting, Cloud Functions, Cloud Run),
// the Firebase Admin SDK automatically discovers service credentials.
// For local development, you must set up Application Default Credentials (ADC).
// 1. Install the gcloud CLI: https://cloud.google.com/sdk/docs/install
// 2. Authenticate with the CLI: `gcloud auth application-default login`
// This command will open a browser window to log in with your Google account.
// Ensure the account has the necessary permissions on your Firebase project.

if (!admin.apps.length) {
  try {
    admin.initializeApp({
        // The projectId is automatically inferred from the environment
        // in Google Cloud environments. For local development with ADC,
        // it's good practice to specify it, though often not strictly necessary.
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'prime-panier',
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
