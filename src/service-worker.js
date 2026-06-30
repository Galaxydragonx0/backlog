/// <reference types="@sveltejs/kit" />
// SvelteKit service worker — app-shell offline caching for the Backlog PWA.
// Cross-origin requests (Firebase / Firestore / TMDB / Google auth) are left
// untouched so they always hit the network.

import { build, files, version } from '$service-worker';

const CACHE = `backlog-cache-${version}`;

// Everything we can precache: the built JS/CSS + static assets (icons, fonts…).
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			await cache.addAll(ASSETS);
			self.skipWaiting();
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			// Drop caches from previous deployments.
			for (const key of await caches.keys()) {
				if (key !== CACHE) await caches.delete(key);
			}
			await self.clients.claim();
		})()
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;

	// Only handle GET; never interfere with POST/auth/Firestore writes.
	if (request.method !== 'GET') return;

	const url = new URL(request.url);

	// Same-origin only. Let Firebase, Firestore, TMDB, Google, etc. go to the
	// network directly (Firestore has its own offline persistence layer).
	if (url.origin !== self.location.origin) return;

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);

			// Precached build/static assets: serve from cache first (fast + offline).
			if (ASSETS.includes(url.pathname)) {
				const cached = await cache.match(url.pathname);
				if (cached) return cached;
			}

			// Everything else (navigations, dynamic routes): network-first, fall
			// back to whatever we have cached when offline.
			try {
				const response = await fetch(request);
				// Cache successful basic responses for offline reuse.
				if (response.status === 200 && response.type === 'basic') {
					cache.put(request, response.clone());
				}
				return response;
			} catch (err) {
				const cached = await cache.match(request);
				if (cached) return cached;
				throw err;
			}
		})()
	);
});
