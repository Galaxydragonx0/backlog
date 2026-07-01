// @ts-nocheck
// Tiny global toast store. Call `showToast('message')` from anywhere and the
// <Toast /> component mounted in the root layout renders it, then auto-dismisses.
import { writable } from "svelte/store";

export const toasts = writable([]);

let nextId = 0;

/**
 * Push a transient toast onto the stack.
 * @param {string} message - text to display
 * @param {number} [duration] - ms before it auto-dismisses
 */
export function showToast(message, duration = 2400) {
  const id = ++nextId;
  toasts.update((all) => [...all, { id, message }]);
  setTimeout(() => {
    toasts.update((all) => all.filter((t) => t.id !== id));
  }, duration);
}
