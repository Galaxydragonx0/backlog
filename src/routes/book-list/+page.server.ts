import { env } from "$env/dynamic/private";
import { error, redirect, type HttpError } from '@sveltejs/kit';


export const load = async ({locals}) => {


// const fetchUserMovies = async () => {

    if(!locals.user?.apiKey) return ({api_key: env.guest_api_key});
    

    const url = `${env.server_url}/getBooks`
    const code_key = locals.user.apiKey




    // ToDo: remove hard coded - api-key used for authentication
    let books = await fetch(url, {
    method: 'GET',
    headers:{
        "Content-Type": "application/json",
        "Authorization": `ApiKey ${code_key}`
    }
    })
    .then((requestResponse) => {
        if (requestResponse.status == 401 || requestResponse.status == 403)
        {
            throw error(requestResponse.status, "You are not allowed to do this ngl");
        }
        if(requestResponse.status >= 500)
        {
            throw error(500,"The server went to touch some grass, bro is better than us fr")
        }
        if (requestResponse.status == 200){
            return requestResponse.json();
        }
        
    })


// };

return {books};
}


// export const actions = {
//     remove : async({cookies}) =>{}
// }
