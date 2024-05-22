import { writable } from "svelte/store";


const showList = writable([]);
const guestShowList = writable([]);


export {showList, guestShowList};