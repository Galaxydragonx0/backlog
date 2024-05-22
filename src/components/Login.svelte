<script>
    // @ts-ignore
    import { any, boolean } from "zod";

// @ts-nocheck

    import UserDataStore from "../routes/UserDataStore";
    // export const prerender = false
	// @ts-ignore
	export let showModal; // boolean
    // @ts-ignore
    /**
     * @type {any}
     */
     export let auth_errors;
    /**
     * @type {{ login: any; register: any; }}
     */
     // @ts-ignore
     export let viewPassThrough;
    

    // update the store to collect the user info
    $: userData = $UserDataStore;

	// @ts-ignore
	/**
     * @type {HTMLDialogElement}
     */
	let dialog;
    $: loginView = viewPassThrough.login ;

    $: signupView = viewPassThrough.register;

    import { createEventDispatcher } from "svelte";
    import { goto } from "$app/navigation";
    // import type { ActionData } from "../routes/list-menu/$types";
    let dispatch = createEventDispatcher()

    function closeModal(){
        // @ts-ignore
        dispatch('closeModal', showModal)
    }

    function logout(){
        // UserDataStore.update((data) => {
        //     data.api_key = '';
        //     data.user_email = '';
        //     return {user_email: data.user_email, api_key: data.api_key}
        // })
            localStorage.removeItem('savedMovies')
    }

    function login(){
        goto('/list-menu?/login')
    }

    // @ts-ignore
    /**
     * @type {{ errors: { email: any[]; }; }}
     */
     export let form;
    // @ts-ignore
   // @ts-ignore
     $: if (dialog && showModal) dialog.showModal();
</script>


<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	class="dialog-pop"
	bind:this={dialog}
	on:close={() => {if(!form?.errors?.email && !auth_errors){showModal = false}}}
	on:click|self={() => {loginView=true; signupView=false; closeModal(); dialog.close();}}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->

    <div class="form-container" on:click|stopPropagation>

        <div class="header" style="display: flex; justify-content: space-between;">
            {#if !$UserDataStore.user_email && $UserDataStore.api_key == "00000000-0000-0000-0000-000000000000"}
                <p class="login-view" on:click={() => {loginView = true; signupView = false;}}>Login</p>
                <p class="signup-view" on:click={() => {signupView = true; loginView=false;}}>/SignUp</p>
            {:else if $UserDataStore.user_email}
                <p class="logout-view">Logout</p>
            {/if}
            
        </div>
        {#if loginView && (userData.api_key == "00000000-0000-0000-0000-000000000000")}
        <!-- show validations for form fields -->
            <form method="POST" action="/list-menu?/login">
                <label class="email-label" for="email">Email</label>
                <input type="email" name="email" id="email">
                {#if form?.errors?.email}
                    <p class="error">{form?.errors?.email[0]}</p>
                {:else if auth_errors?.error}
                    <p class="error">{auth_errors?.error}. Try clicking SignUp</p>
                {/if}
                <!-- <label for="pwd">Password</label>
                <input type="password" name="password" id="pwd"> -->

                <button class="btn" on:click={login}>Login</button>
            </form>
        {/if}
        {#if signupView && (userData.api_key == "00000000-0000-0000-0000-000000000000")}
            <form method="post" action="/list-menu?/register">
                <label class="email-label" for="email">Email</label>
                <input type="email" name="email" id="email">
                {#if form?.errors?.email}
                <p class="error">{form?.errors?.email[0]}</p>
                {:else if auth_errors?.error}
                    <p class="error">{auth_errors?.error}. Objective failed try again</p>
                {/if}

                <button class="btn">Register</button>
            </form>
        {/if}
        {#if userData.api_key && userData.api_key != "00000000-0000-0000-0000-000000000000" && !form?.errors?.email[0]}
        <form action="/list-menu?/logout" method="post">
                <h3 class="logout-email">{userData?.user_email}</h3>
                <button class="btn" on:click={logout}>Logout</button>
            </form>
        {/if}
    </div>
</dialog>

<style>

@font-face{
    font-family: "header-font";
    src: url('../../static/fonts/PublicPixel.ttf');

    font-family: "Rubik";
    src: url('../../src/assets/fonts/Rubik-Regular.ttf');
}

.login-view, .logout-view, .signup-view{
    font-family: "header-font";
}

.login-view:hover, .signup-view:hover{
    cursor: pointer;
    color: darkcyan;
}

.login-view:focus, .signup-view:focus{
    cursor: pointer;
    color: darkcyan;
}


.logout-email{
    font-family: 'Rubik';
    font-style: italic;
    font-weight: bolder;
    color: #cf4343;
    text-align: center;
}

.email-label{
    font-family: 'header-font';
}

.btn{
    display: block;
    color: red;
    background-color: midnightblue;
    height: 2.5rem;
    margin-top: 3rem;
    font-family: 'header-font';
    width: 17rem;
    box-shadow: none;
}

.login-view:hover, .signup-view:hover{
    text-decoration: underline;
} 

.error{
    width: 14rem;
    font-size: 0.7rem;
    color: #975151;
    text-align: left;
}

.header{
    padding-bottom: 4rem;
}

input, label, .form-container{
    display: block;
}

p{
    font-size: 1.5rem;
}

input{
    width: 16rem;
    padding: 0 5px 0 5px;
    height: 1.5rem;
    color: black;
    font-weight: 600;
    margin-bottom: 1.5rem;
}

label{
    font-size: 1.2rem;
    text-align: left;
    padding-bottom: 0.5rem;
}
.dialog-pop{
		backdrop-filter: blur(10px) saturate(4);
		background-color: #181818;
		background: rgb(0 0 0 / 69%);
		border-radius: 10px;
		color: wheat;
        padding:1rem;
	}

    dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	/* dialog > div {
		padding: 1em;
	} */

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}


     /* short ahhhh phone */
     @media screen and (min-height:600px )
    {

    }

    /* long ahhhh phone */
    @media screen and (min-height:750px )
    {

    }


    /* small tablet styles */
    @media screen and (min-width: 620px){

    }

    /* large tablet & laptop styles */
    @media screen and (min-width: 960px){



    }

    /* desktop styles */
    @media screen and (min-width: 1200px){
        

        .error{
            width: 14rem;
            font-size: 1rem;
            font-family: monospace;
            color: #975151;
            text-align: left;
        }

        .form-container{
            padding: 2rem;
        }

        p{
            font-size: 2rem;
        }

    }
</style>