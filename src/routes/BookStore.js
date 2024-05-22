import { writable } from "svelte/store";

const bookList = writable([]);
const guestBookList = writable([]);



export {bookList, guestBookList};