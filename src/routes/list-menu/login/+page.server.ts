import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import { zfd } from 'zod-form-data';
import { z } from "zod";
// import type { PageServerLoad, Actions } from './$types';
// export const prerender = false;

//put a load function and export it as data to the frontend 
// create a global variable to save the error or user to update the login and header functionality

let api_key = ""
let user_email : FormDataEntryValue | null;

let formErrors = {}
let auth_errors = {status : -1, error: ''};

export async function load({request}) {
    // return {auth_errors}
}

export const actions ={


}