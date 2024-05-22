import { writable } from "svelte/store";

const gameList = writable([]);
const guestGameList = writable([]);



export {gameList, guestGameList};