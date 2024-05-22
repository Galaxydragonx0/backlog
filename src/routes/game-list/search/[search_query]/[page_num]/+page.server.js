// @ts-nocheck

import { env } from '$env/dynamic/private';

export const prerender = false;

let totalPages
let gameArray
let searchOffset = 0


export async function load({locals  , params }) {

    const { search_query, page_num } = params;

    if(parseInt(page_num) > 1){
        searchOffset = (parseInt(page_num) - 1) * 15
    }

    const url = `http://www.giantbomb.com/api/games/?api_key=${env.game_api_key}&limit=15&offset=${searchOffset}&filter=name:${search_query}&format=json&field_list=original_release_date,id,genres,api_detail_url,name,image,deck&page=${page_num},`
    const resp = await fetch(url)
    const data = await resp.json()

    gameArray = data
    totalPages = data.total_pages

    let userData;

    if (locals.user){
        userData = locals?.user.apiKey;
    }
    else{
        userData = env.guest_api_key;
    } 
   
     


    if (gameArray != null) {
        return { gameArray, totalPages, search_query, page_num, userData };
    }

}










