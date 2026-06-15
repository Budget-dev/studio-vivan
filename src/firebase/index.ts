'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  let app: FirebaseApp;
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      app = initializeApp();
    } catch (e) {
      // Fallback to config object if automatic discovery fails (common on Vercel/Local)
      app = initializeApp(firebaseConfig);
    }
  } else {
    app = getApp();
  }

  const sdks = getSdks(app);

  // Diagnostic Logs for Investigation
  if (typeof window !== 'undefined') {
    console.log('[Firebase Init] Project ID:', app.options.projectId);
    console.log('[Firebase Init] Current Auth State:', sdks.auth.currentUser ? `User: ${sdks.auth.currentUser.uid}` : 'Guest');
    
    // Check for Emulator
    const isEmulator = (sdks.firestore as any)._settings?.host?.includes('localhost') || false;
    console.log('[Firebase Init] Firestore Emulator Active:', isEmulator);
  }

  return sdks;
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';