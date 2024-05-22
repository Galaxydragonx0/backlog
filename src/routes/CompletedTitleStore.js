import { writable } from "svelte/store";


const CompletedStore = writable([]);

const guestCompletedStore = writable([]);

export {CompletedStore, guestCompletedStore};