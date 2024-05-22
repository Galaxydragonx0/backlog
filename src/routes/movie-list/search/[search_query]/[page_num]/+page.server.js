// @ts-nocheck

import { env } from '$env/dynamic/private';

// export const prerender = false;

let totalPages
let movieArray


// on load we can probably show popular movies for easy access 


export async function load({locals  , params }) {

    const { search_query, page_num } = params;

    const url = `https://api.themoviedb.org/3/search/movie?query=${search_query}&include_adult=false&language=en-US&page=${page_num}`
    const resp = await fetch(url, 
        {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTI3ZGNiYzBkNjFlODFkNGYwZmY3MDNhM2U5MTNiMCIsInN1YiI6IjY1NTNmYzgzMDgxNmM3MDBhYmJiZmQ1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BUTY6swPgxrytMFboGO4qoTEUcq1gNaUFbMQ18s-4cY'
              }
        }
    )
    const data = await resp.json()

    movieArray = data.results
    totalPages = data.total_pages

    let userData;

    if (locals.user){
        userData = locals?.user.apiKey;
    }
    else{
        userData = env.guest_api_key;
    } 
   
     


    if (movieArray != null) {
        return { movieArray, totalPages, search_query, page_num, userData };
    }

}










