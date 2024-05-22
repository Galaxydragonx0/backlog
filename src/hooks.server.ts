import { browser } from '$app/environment';
import type {Handle} from '@sveltejs/kit';


export const handle:Handle = async ({ event, resolve, }) => {
    // get cookies from browser
    const session = event.cookies.get('session');
    const email = event.cookies.get('email');
    
  
    if (!session) {
      // if there is no session load page as normal
      return await resolve(event)
    }

    event.locals.user = {
      apiKey : session,
      email : email,
    }

    return await resolve(event)
}