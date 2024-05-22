<script lang="ts">
    // @ts-nocheck
    import { browser } from '$app/environment';
    import Icon from '@iconify/svelte';
    import { createEventDispatcher } from "svelte";
    import UserDataStore from '../../UserDataStore.js';

    export let form;
    export let data;

        // @ts-ignore
    $: loginView=true
    $: signupView = false;

    
    let dispatch = createEventDispatcher()

    function login(){
        dispatch('login')
    }

    let redirected = false;

    if(browser){

        let words = document.referrer.split('/');
        if(words[words.length-1] != 'login'){
            redirected = true;
        }

        window.localStorage.setItem("email", data.user.email);
    }
    
        UserDataStore.update((currdata) => {
            return {user_email: data.user_email, api_key: ''}
        })

    
        // @ts-ignore
        // $: if (dialog && showModal) dialog.showModal();
    </script>
    
    
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->

        <!-- svelte-ignore a11y-no-static-element-interactions -->
    
        
    <div class="login-container">
            {#if redirected}
                <p class="error-message">Seems like you weren't signed in. It's the best way to track your titles <button><Icon class='arrow' icon="pixelarticons:arrow-right" /></button></p>
            {/if}
            <p class="welcome-message">Welcome back<button><Icon class='welcome-arrow' icon="pixelarticons:arrow-right" /></button></p>
            <div class="form-container">
                <div class="header">
                    <p class="login-view" on:click={() => {loginView = true; signupView = false;}}>Login</p><p class="signup-view" on:click={() => {signupView = true; loginView=false;}}>/SignUp</p>
                </div>
                {#if loginView}
                <!-- show validations for form fields -->
                    <!-- <form method="POST" action="?/login">
                        <label for="email">Email</label>
                        <input type="email" name="email" id="email">
                        {#if form?.errors?.email}
                            <p class="error">{form?.errors?.email}</p>
                        {/if}
        
                        <button class="btn">Login</button>
                    </form> -->
                    <form method="POST" action="/list-menu?/login">
                        <label class="email-label" for="email">Email</label>
                        <input type="email" name="email" id="email">
                        {#if form?.errors?.email}
                            <p class="error">{form?.errors?.email[0]}</p>
                        {:else if data.auth_errors?.error}
                            <p class="error">{data.auth_errors?.error}. Try clicking SignUp</p>
                        {/if}
                        <!-- <label for="pwd">Password</label>
                        <input type="password" name="password" id="pwd"> -->
        
                        <button class="btn" on:click={login}>Login</button>
                    </form>
                {/if}
                {#if signupView}
                    <!-- <form method="post" action="?/register">
                        <label for="email">Email</label>
                        <input type="email" name="email" id="email">

                        <button class="btn">Register</button>
                    </form> -->
                    <form method="post" action="/list-menu?/register">
                        <label class="email-label" for="email">Email</label>
                        <input type="email" name="email" id="email">
                        {#if form?.errors?.email}
                        <p class="error">{form?.errors?.email[0]}</p>
                        {:else if data.auth_errors?.error}
                            <p class="error">{data.auth_errors?.error}. Objective failed try again</p>
                        {/if}
        
                        <button class="btn">Register</button>
                    </form>
                {/if}
        </div>
    </div>
    
<style>
    @import '../../../../styles.css';
    @import url("https://fonts.googleapis.com/css2?family=DotGothic16&display=swap");
    @font-face{	
        font-family: 'header-font';
		src: url('../../../assets/fonts/PublicPixel.ttf')
    }


.login-container{
    font-family: "DotGothic16", sans-serif;
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: repeat(10, 1fr);
    grid-template-columns: repeat(12, 1fr);
    align-items: center;
    justify-items: center;
    background-color: #181818;
}


.welcome-message{
    font-family: "DotGothic16", sans-serif;
    grid-column: 3 / 6;
    grid-row: 5 / 6;
    color: aquamarine;
    position: relative;
}

.error-message{
    font-family: "DotGothic16", sans-serif;
    grid-column: 3 / 6;
    grid-row: 5 / 6;
    color: aquamarine;
    position: relative;
}

.form-container{
    grid-column: 8 / -1;
    grid-row: 5 / 6;
}

button :global(.welcome-arrow) {
        font-size: 3rem;
        position: absolute;
        right: 5rem;
        top: 3.5rem;
        color: aquamarine;
	}

button :global(.arrow) {
        font-size: 3rem;
        position: absolute;
        right: -6rem;
        top: 3rem;
        color: aquamarine;
	}

.header{
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    text-align: center;
    color: aquamarine;
}

form{
    grid-row: 3;
    grid-column: 1 / -1;
    color: red;
}

.error{
    font-size: 0.7rem;
    color: #975151;
}
.btn{
    display: block;
    color: red;
    background-color: midnightblue;
    height: 2.5rem;
    margin-top: 2rem;
    font-family: 'header-font';
    width: 16rem;
    box-shadow: none;
}

.login-view:hover, .signup-view:hover{
    text-decoration: underline;
} 

input, label{
    display: block;
}

p{
    font-size: 1.5rem;
}

input{
    width: 16rem;
    height: 1.5rem;
    margin-bottom: 1.5rem;
}

label{
    font-size: 1.2rem;
    text-align: left;
    padding-bottom: 0.5rem;
    padding-top: 1rem;
}
/* .dialog-pop{
        backdrop-filter: blur(10px) saturate(4);
        background-color: #181818;
        background: rgb(0 0 0 / 69%);
        border-radius: 10px;
        color: wheat;
    }

    dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }

    dialog > div {
        padding: 1em;
    }

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
    } */


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
        p{
            font-size: 2rem;
        }

    }
</style>