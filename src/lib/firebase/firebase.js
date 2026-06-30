// @ts-nocheck
// Firebase client initialisation for the Backlog PWA.
//
// NOTE: this config is intentionally committed. A Firebase *web* config is a
// public identifier, not a secret — access is enforced by Firestore Security
// Rules + the Auth "authorized domains" list, not by hiding these values.
// (See https://firebase.google.com/docs/projects/api-keys )
import { browser } from '$app/environment';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager
} from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyC949rFDLtJwcQ2RKYvJZE8CqJ7BB_XGFk',
	authDomain: 'backlog-a8e1c.firebaseapp.com',
	projectId: 'backlog-a8e1c',
	storageBucket: 'backlog-a8e1c.firebasestorage.app',
	messagingSenderId: '32984446225',
	appId: '1:32984446225:web:a4c2d55e58b282bd9288b0',
	measurementId: 'G-7F15Y33VKY'
};

// Reuse the existing app instance across HMR / re-imports.
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Firestore. In the browser we enable IndexedDB-backed offline persistence
// (multi-tab safe) so the app keeps working with no signal — the whole point
// of the PWA. During SSR there is no IndexedDB, so fall back to the default
// (in-memory) cache; the real data work happens client-side anyway.
export const db = browser
	? initializeFirestore(app, {
			localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
		})
	: initializeFirestore(app, {});

// Analytics is browser-only and must be feature-detected (it is unsupported in
// some environments / when blocked). Loaded lazily so it never breaks SSR.
export async function initAnalytics() {
	if (!browser) return null;
	const { getAnalytics, isSupported } = await import('firebase/analytics');
	return (await isSupported()) ? getAnalytics(app) : null;
}
