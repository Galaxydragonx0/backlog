// @ts-nocheck

import { env } from '$env/dynamic/private';

// export const prerender = false;

let totalPages
let bookArray
let searchOffset = 0
let url = ''

export async function load({locals  , params }) {

    const { search_query, page_num } = params;

    if(parseInt(page_num) == 1){
        url = `https://www.googleapis.com/books/v1/volumes?q=${search_query}&startIndex=0&maxResults=14&key=${env.book_api}`
    }
    else{
        searchOffset = (parseInt(page_num) - 1) * 15
        url = `https://www.googleapis.com/books/v1/volumes?q=${search_query}&startIndex=${searchOffset}&maxResults=14&key=${env.book_api}`
    }

    const resp = await fetch(url)
    const data = await resp.json()

    bookArray = data
    totalPages = data.total_items

    let userData;

    if (locals.user){
        userData = locals?.user.apiKey;
    }
    else{
        userData = env.guest_api_key;
    } 
   
    // let books = bookArray.items

    if (bookArray != null) {
        return { bookArray, totalPages, search_query, page_num, userData };
    }

}










