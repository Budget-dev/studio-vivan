'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  let app: FirebaseApp;
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e) {
      app = initializeApp(firebaseConfig);
    }
  } else {
    app = getApp();
  }

  const sdks = getSdks(app);

  // CRITICAL DIAGNOSTICS: Check these in your browser console
  if (typeof window !== 'undefined') {
    console.log('%c--- FIREBASE INIT DIAGNOSTICS ---', 'background: #0D3520; color: #fff; padding: 2px 5px;');
    console.log('Project ID:', app.options.projectId);
    console.log('API Key:', app.options.apiKey?.substring(0, 6) + '...');
    
    // Check if emulator is being triggered by env vars
    const isEmulator = (sdks.firestore as any)._settings?.host?.includes('localhost') || false;
    console.log('Firestore Emulator:', isEmulator ? 'ACTIVE' : 'OFF (Production)');
    
    sdks.auth.onAuthStateChanged(user => {
      console.log('Auth State Change:', user ? `Logged in as ${user.email}` : 'Anonymous / Guest');
    });
    console.log('---------------------------------');
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