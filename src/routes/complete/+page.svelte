<script>
    // @ts-nocheck
    import { onDestroy } from "svelte";
    import { writable } from "svelte/store";
    import { browser } from "$app/environment";
    import Title from '../../components/Title.svelte';
    import SignInGate from '../../components/SignInGate.svelte';
    import { authUser } from '$lib/firebase/auth';
    import { subscribeList } from '$lib/firebase/db';

    // Live-sync the user's completed titles from Firestore.
    const completedTitles = writable([]);
    let unsub;
    $: if (browser) {
        if ($authUser) {
            unsub?.();
            unsub = subscribeList($authUser.uid, 'completed', (items) => completedTitles.set(items));
        } else if ($authUser === null) {
            unsub?.();
            unsub = undefined;
            completedTitles.set([]);
        }
    }
    onDestroy(() => unsub?.());
</script>

<div class="ovr-container">
    <div class="header">
        <h1>Completed Titles</h1>
    </div>
    {#if $authUser === null}
        <SignInGate message="Sign in to view your completed titles." />
    {:else if $authUser}
        <div class="title-grid">
            {#each $completedTitles as title (title.id)}
                <div class="title-container">
                    <Title title={title} titleGenre={title.title_genre}/>
                </div>
            {/each}
        </div>
    {/if}
</div>


<style>
    @import '../../../styles.css';
    .ovr-container {
    background: #181818;
    padding: 0.7rem;
    height: 100dvh;
    overflow: auto;
  }
    /* short ahhhh phone */
    @media screen and (min-height: 600px) {

        
        .header{
            font-family: 'header-font';
            display: flex;
            flex-direction: column;
            font-size: 12px;
            padding-left: 19px;
            height: 11rem;
            justify-content: center;
            align-items: center;
            color: #21d4d5;
            background: #181818;
        }

        .title-grid{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: auto;
        justify-items: center;
        background-color: #181818;
        height: 100dvh;
        /* overflow-y: hidden; */
        }

        .title-container{
            padding-top:20px;
        }

    }

    /* long ahhhh phone */
    @media screen and (min-height: 750px) {

        .header{
            font-family: 'header-font';
            display: flex;
            flex-direction: column;
            font-size: 13px;
            padding-left: 32px;
            height: 9rem;
            justify-content: center;
            align-items: center;
            color: #21d4d5;
            background: #181818;
        }

        .title-grid{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: auto;
            justify-items: center;
            background-color: #181818;
            height: 100dvh;
            /* overflow-y: hidden; */
            padding: 17px;
        }
    }


    @media screen and (min-width: 1200px) {

        /* body{
            overflow-y: hidden;
        } */

        .ovr-container {
            background: #181818;
            padding: 2rem 6.7rem;
            overflow-y: auto;
            height: 100dvh;
        }

        .header{
            font-family: 'header-font';
            display: flex;
            flex-direction: column;
            font-size: 1.5rem;
            height: 11rem;
            justify-content: center;
            align-items: center;
            color: #21d4d5;
            background: #181818;
        }

        .title-grid{
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-auto-rows: auto;
            justify-items: center;
            background-color: #181818;
            height: 120dvh;
            /* overflow-y: hidden; */
        }

        .title-container{
            padding-top:20px;
        }

        :global(.ovr-container::-webkit-scrollbar) {
			width: 0.5rem;
		}

		:global(::-webkit-scrollbar-track) {
			background: #181818;
		}

		:global(::-webkit-scrollbar-thumb) {
			background: black;
			border-radius: 10px;
		}

    }
</style>