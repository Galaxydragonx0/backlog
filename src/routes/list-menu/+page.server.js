
// @ts-nocheck
import { env } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import { zfd } from 'zod-form-data';
import { z } from "zod";
// export const prerender = false;

// put a load function and export it as data to the frontend 
// create a global variable to save the error or user to update the login and header functionality

let api_key = ""
let user_email = ""
let formErrors = {}
let auth_errors = {status : '-1', error: ''};
let viewPassthrough = {login: true, register: false}


let completedListData;

export async function load({locals}) {

    if(locals.user) api_key = locals?.user.apiKey;
    else{
        api_key = "00000000-0000-0000-0000-000000000000";
    }
    // user_email = locals?.user.user_email;
    let modalPassthrough = false;
    if(Object.keys(formErrors)!=0 || auth_errors.error || !locals.user){
        return {user_email, api_key, formErrors, modalPassthrough, auth_errors, viewPassthrough}
    }

    modalPassthrough = false;
    return {user_email, api_key, formErrors, modalPassthrough, auth_errors, viewPassthrough, completedListData}
    
}

export const actions ={
    login: async({cookies, request}) =>
    {
        // get data from forms
        const form_data = await request.formData();

        user_email = form_data.get('email')
        const email = user_email;

        //zod form validaiton 
        const loginSchema = zfd.formData({
            email: z.string({required_error:"Email is required"})
            .min(1, {message:'Email is required'})
            .max(64,{message:"Email must be less than 64 characters"})
            .email({message:"Must be a valid email"})
            }    
        )

        const result = loginSchema.safeParse(form_data)

        if (!result.success){
            formErrors = {
                data: Object.fromEntries(form_data),
                errors: result.error.flatten().fieldErrors
            };
            return {
                data: Object.fromEntries(form_data),
                errors: result.error.flatten().fieldErrors
            }
        }



        let url = `${env.server_url}/login`
      
        let res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({email:email}),
        headers:{
            "Content-type":"application/json;"
        }
        })

        const response = await res.json();

        //get back the error messages if any
        if (res.status >= 400 && res.status<500){
            auth_errors.error = response?.error;
            auth_errors.status = res.status;
        }

        //if no auth errors get the generated key from the user
        //store the api key for authentication
        if(res.status == 200){
            auth_errors.error = response?.error;
            auth_errors.status = res.status;
            api_key = response.api_key
        }

        const completeEndPoint = `${env.server_url}/getCompleted`
        let completedListRaw = await fetch(completeEndPoint,
            {
                method: "GET",
                headers:{
                    "Content-type":"application/json;",
                    Authorization: "ApiKey " +`${api_key}`,
                }
            }
        )

        completedListData = await completedListRaw.json()

        cookies.set('session', api_key,{
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // change to true in prod
            maxAge: 60 * 60 * 24 * 30,
        })

        throw redirect(303, "/list-menu");
    },


    register: async ({cookies, request}) =>
    {
        viewPassthrough = {login:false, register:true}
        const form_data = await request.formData();
        user_email = form_data.get('email');
        const email = user_email;

        //zod form validaiton 
        const registerSchema = zfd.formData({
            email: z.string({required_error:"Email is required"})
            .min(1, {message:'Email is required'})
            .max(64,{message:"Email must be less than 64 characters"})
            .email({message:"Must be a valid email"})
            }    
        )

        const result = registerSchema.safeParse(form_data)

        if (!result.success){
            formErrors = {
                data: Object.fromEntries(form_data),
                errors: result.error.flatten().fieldErrors
            };
            return {
                data: Object.fromEntries(form_data),
                errors: result.error.flatten().fieldErrors
            }
        }

        let url = `${env.server_url}/register`
        
        //call the server register endpoint 
        let returnData = await fetch(url, {
        method: "POST",
        body: JSON.stringify({email:email}),
        headers:{
            "Content-type":"application/json;"
        }
        })    
        .then((requestResponse) => {

            let parsedRes = requestResponse.json()

            if (requestResponse.status >= 400 && requestResponse.status<500)
            {
                auth_errors.status = requestResponse.status;
                auth_errors.error = parsedRes?.error
                throw error(requestResponse.status, parsedRes?.error);
            }
            if(requestResponse.status >= 500)
            {
                throw error(500,"The server went to touch some grass, bro is better than us fr")
            }
            if (requestResponse.status == 200){
                
                auth_errors.error = parsedRes?.error;
                auth_errors.status = 200;
                return parsedRes;
            }
        })


        //if no auth errors get the generated key from the user 
        // store the api key for authentication
        cookies.set('session', returnData.api_key,{
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: false, // change to true in prod
            maxAge: 60 * 60 * 24 * 30,
        })



        throw redirect(303, "/list-menu");
    }, 

    logout: async({cookies}) => {

            cookies.delete('session',{path: '/',})

            //remove the api and email
            user_email = '';
            api_key = '';

            // redirect to list menu with modal closed
            throw redirect(303, '/list-menu')
    }

}