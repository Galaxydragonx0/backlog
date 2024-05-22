import { writable } from "svelte/store";
import UserDataStore from "./UserDataStore";
import { onDestroy } from "svelte";


// let api_key = '';
// UserDataStore.subscribe((storeData) =>
// {
//     // check if this exists if not tell the user to login
//     api_key = storeData.api_key;
// });


const movieList = writable([]);
const guestMovieList = writable([]);


export {movieList, guestMovieList};