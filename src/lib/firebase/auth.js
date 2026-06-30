// @ts-nocheck
// Firebase Auth (Google sign-in) wrapped in a Svelte store.
//
// `authUser` values:
//   undefined -> still resolving the auth state (show nothing / spinner)
//   null      -> signed out
//   User      -> signed in (has .uid, .displayName, .email, .photoURL)
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import {
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';

export const authUser = writable(undefined);

if (browser) {
	onAuthStateChanged(auth, (user) => authUser.set(user ?? null));
}

const provider = new GoogleAuthProvider();

export function signInWithGoogle() {
	return signInWithPopup(auth, provider);
}

export function logout() {
	return signOut(auth);
}
