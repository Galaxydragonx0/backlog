// @ts-nocheck
// Firestore data layer for the Backlog PWA.
//
// Data model — one subcollection per list under the signed-in user:
//   users/{uid}/movies/{itemId}
//   users/{uid}/shows/{itemId}
//   users/{uid}/games/{itemId}
//   users/{uid}/books/{itemId}
//   users/{uid}/completed/{itemId}
//
// Items are keyed by their own id (e.g. the TMDB / game / book id) so adding
// the same title twice is naturally idempotent. Offline writes are queued by
// Firestore's persistent cache and synced when the device reconnects.
import {
	collection,
	doc,
	onSnapshot,
	setDoc,
	deleteDoc,
	serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export const LISTS = /** @type {const} */ (['movies', 'shows', 'games', 'books', 'completed']);

function listRef(uid, list) {
	return collection(db, 'users', uid, list);
}
function itemRef(uid, list, id) {
	return doc(db, 'users', uid, list, String(id));
}

/**
 * Subscribe to a user's list in real time. The callback fires immediately with
 * cached data (offline-friendly) and again on every change. Returns the
 * unsubscribe function — call it in onDestroy.
 */
export function subscribeList(uid, list, cb) {
	return onSnapshot(listRef(uid, list), (snap) => {
		const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
		// Sort newest-first client-side so docs without addedAt aren't dropped
		// (a server-side orderBy would exclude them).
		items.sort((a, b) => (b.addedAt?.toMillis?.() ?? 0) - (a.addedAt?.toMillis?.() ?? 0));
		cb(items);
	});
}

/** Add (or upsert) an item to a list. `item` must carry an `id`. */
export function addItem(uid, list, item) {
	const { id, ...rest } = item;
	return setDoc(itemRef(uid, list, id), { ...rest, addedAt: serverTimestamp() }, { merge: true });
}

/** Remove an item from a list by id. */
export function removeItem(uid, list, id) {
	return deleteDoc(itemRef(uid, list, id));
}

/**
 * Mark an item complete: copy it into `completed`, then remove it from its
 * source list. Two writes; both are queued offline and applied atomically
 * enough for this app's needs.
 */
export async function completeItem(uid, sourceList, item) {
	await addItem(uid, 'completed', { ...item, completedFrom: sourceList });
	await removeItem(uid, sourceList, item.id);
}
