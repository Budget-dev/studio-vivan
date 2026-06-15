'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  let app: FirebaseApp;
  if (!getApps().length) {
    // Attempt to initialize via Firebase App Hosting environment variables
    try {
      app = initializeApp();
    } catch (e) {
      // Fallback to config object if automatic discovery fails
      app = initializeApp(firebaseConfig);
    }
  } else {
    app = getApp();
  }

  const sdks = getSdks(app);

  // Diagnostic Logs for Investigation
  if (typeof window !== 'undefined') {
    console.log('--- FIREBASE DIAGNOSTICS ---');
    console.log('[Init] Project ID:', app.options.projectId);
    console.log('[Init] Config API Key:', app.options.apiKey?.substring(0, 6) + '...');
    console.log('[Init] Current Auth:', sdks.auth.currentUser ? `UID: ${sdks.auth.currentUser.uid}` : 'Guest/Null');
    
    // Check for Emulator
    const isEmulator = (sdks.firestore as any)._settings?.host?.includes('localhost') || false;
    console.log('[Init] Firestore Emulator Active:', isEmulator);
    console.log('---------------------------');
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
