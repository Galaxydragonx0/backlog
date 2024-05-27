<script>
// @ts-nocheck

    import Icon from "@iconify/svelte";
    import Login from "../components/Login.svelte";
    import UserDataStore from "../routes/UserDataStore";
    import { base } from '$app/paths';
    export let formData;
    export let modalPassthrough
    export let viewPassThrough = {};
    export let auth_errors;
    

    $: userStore = $UserDataStore
    $: showModal = modalPassthrough;
    
    let toggleModal = () => {
        showModal = !showModal;
    };

    let closeModal = (event) =>{
        showModal = !event.detail;
    }
    // @ts-ignore
    var width;
    // @ts-ignore
    var height;

</script>


<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<header style="line-height: normal;">
    <a class="logo-link" href="{base}/list-menu">
        <p class="the">the</p>
        <p class="backlog">Backlog</p>
    </a>

{#if auth_errors?.status == -1}
    {#if height >= 945}
        <!-- logged in larger mobile screens and greater -->
        {#if $UserDataStore.api_key != "00000000-0000-0000-0000-000000000000" && (!formData?.errors.email || formData == null) && !auth_errors.error}
            <button class="email" on:click={toggleModal}>
                <p class="email-text">{userStore.user_email}</p>
                
            </button>
        {/if}

        <!-- logged out larger mobile screens and greater -->
        {#if $UserDataStore.api_key == "00000000-0000-0000-0000-000000000000" && (formData?.errors.email || auth_errors.error)}
        <button on:click={toggleModal} class="login">
            <span >
                <Icon class="avatar" icon="carbon:user-avatar-filled-alt" />
            </span>
        </button>
        {/if}
    {/if}

    {#if height <= 944 }
        {#if userStore.api_key && !formData?.errors.email && !auth_errors.error }
        <button class="avatar-pic" on:click={toggleModal}>
            <Icon class="avatar" icon="carbon:user-avatar-filled-alt" />
        </button>
        {/if}
        {#if !userStore.api_key && (formData?.errors.email || auth_errors.error)}
        <button class="avatar-pic" on:click={toggleModal}>
            <Icon class="avatar" icon="carbon:user-avatar-filled-alt" />
        </button>
        {/if}
    {/if}
{/if}

{#if height >= 945}
    <!-- logged in larger mobile screens and greater -->
    {#if $UserDataStore.api_key != "00000000-0000-0000-0000-000000000000" && (!formData?.errors.email || formData == null) && !auth_errors.error}
        <button class="email" on:click={toggleModal}>
            <p class="email-text">{userStore.user_email}</p>
        </button>
    {/if}

    <!-- logged out larger mobile screens and greater -->
    {#if $UserDataStore.api_key == "00000000-0000-0000-0000-000000000000" && (!formData?.errors.email || auth_errors.error)}
    <button on:click={toggleModal} class="login">
        <span >
            <Icon class="avatar" icon="carbon:user-avatar-filled-alt" />
        </span>
    </button>
    {/if}
{/if}

{#if height <= 944 }
    {#if userStore.api_key && !formData?.errors.email && !auth_errors.error }
    <button class="avatar-pic" on:click={toggleModal}>
        <Icon class="avatar" icon="carbon:user-avatar-filled-alt" />
    </button>
    {/if}
    {#if !userStore.api_key && (formData?.errors.email || auth_errors.error)}
    <button class="avatar-pic" on:click={toggleModal}>
        <Icon class="avatar" icon="carbon:user-avatar-filled-alt" />
    </button>
    {/if}
{/if}

    <Login showModal={showModal} form={formData} auth_errors={auth_errors} viewPassThrough={viewPassThrough} on:closeModal={closeModal}/>
</header>


<style>

    @font-face{
		font-family: 'header-font';
		src: url('../../static/fonts/PublicPixel.ttf')
	}

    .logo-link{
        text-decoration: none;
    }

    .logo-link :visited{
        text-decoration: none;
    }

    .the, .backlog{
        font-weight: 1000;
        font-family: 'header-font';
        font-size: 3rem;
        color: red;
        margin: 0;
    }

    .avatar-pic{
        color: wheat;
        position: absolute;
        top: 1.2rem;
        right: 1rem;
        height: 4rem;
        width: 4rem;
        border: none;
        border-radius: 25px;
        font-family: "header-font";
        font-size: 2.5rem;
        font-weight: 550;
        text-align: center;
        overflow: hidden;
        background-color: #181818;
    }


    header
    {
        background: #181818;
        padding: 1rem;
        padding-top: 2rem;
    }

    h1
    {
        color: red;
        font-family: 'header-font';
        margin: 0;
        text-align: start;
        font-size: 2.2rem;
    }

    /* short ahhhh phone */
    @media screen and (min-height:600px )
    {
 
        .the, .backlog{
        font-weight: 1000;
        font-family: 'header-font';
        font-size: 1.5rem;
        color: red;
        margin: 0;
    }
        .login{
        color: wheat;
        position: absolute;
        top: 2rem;
        right: 1rem;
        height: 4rem;
        width: 4rem;
        border: none;
        border-radius: 25px;
        font-family: "header-font";
        font-size: 2rem;
        font-weight: 550;
        text-align: center;
        overflow: hidden;
        background-color: #181818;
        }
        h1
        {
            font-size: 1.4rem;
        }
    }

    /* long ahhhh phone */
    @media screen and (min-height:750px )
    {
        h1
        {
            font-size: 2em;
        }

        .login{
        color: wheat;
        position: absolute;
        top: 2rem;
        right: 1rem;
        height: 4rem;
        width: 4rem;
        border: none;
        border-radius: 25px;
        font-family: "header-font";
        font-size: 2rem;
        font-weight: 550;
        text-align: center;
        overflow: hidden;
        background-color: #181818;
        }

    }


    /* small tablet styles */
    @media screen and (min-width: 620px){

    }

    /* large tablet & laptop styles */
    @media screen and (min-width: 960px){



    }

    /* desktop styles */
    @media screen and (min-width: 1200px){

        h1
        {
            font-size: 3.5rem;
        }

        header
        {
            background: #181818;
            padding: 1rem;
            padding-top: 2rem;
            padding-left: 3rem;
        }

        .the, .backlog{
            font-weight: 1000;
            font-family: 'header-font';
            font-size: 2rem;
            color: red;
            margin: 0;
        }

        .email{
            color: #08086b;
            position: absolute;
            top: 5rem;
            right: 13rem;
            height: 1.5rem;
            width: 17rem;
            border: none;
            border-radius: 12px;
            font-family: "header-font";
            font-size: 1rem;
            font-weight: 550;
            text-align: center;
            overflow: hidden;
            background-color: #993953;
        }

        .email-text{
            margin-top: 0px;
        }

        .login{
        color: wheat;
        position: absolute;
        top: 1.7rem;
        right: 7rem;
        height: 4rem;
        width: 4rem;
        border: none;
        border-radius: 25px;
        font-family: "header-font";
        font-size: 3rem;
        font-weight: 550;
        text-align: center;
        overflow: hidden;
        background-color: #181818;
        }

        .login:hover span {
            display: none;
        }

        .login:hover {
            width: 20rem;
            transition: width 800ms;
        }

        .login::after {
            content: "";
            width: 160px;
            display: none;
        }

        .login:hover::before {
            content: "Login/Sign-Up";
            display: inline-block;
            font-size: 1rem;
        }

        .login:hover,
        .login:focus {
            animation: raise 2s;
            box-shadow: 0 0 0 2em transparent;
        }

    }


</style>
