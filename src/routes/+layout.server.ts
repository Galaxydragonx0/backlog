import type { LayoutServerLoad } from './$types'


let api_key = ""
let user_email = ""
let formErrors = {}
let auth_errors = {status : -1, error: ''};
let viewPassthrough = {login: true, register: false}

export const load: LayoutServerLoad = async ({ locals}) => {
    return {
      user: locals.user,

    }
  }

  // export const prerender = true;

