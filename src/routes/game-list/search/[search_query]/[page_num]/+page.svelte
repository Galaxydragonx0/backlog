<script>
    // @ts-nocheck

    import Icon from "@iconify/svelte";
    // import Header from "../../../../components/Header.svelte";
    import Title from "../../../../../components/Title.svelte";
    import PageSearch from "../../../../../components/PageSearch.svelte";
    import {gameList, guestGameList} from "../../../../GameStore";
    import UserDataStore from "../../../../UserDataStore";
    import { onDestroy } from "svelte";
    // import { addToast } from "../../../../../components/Toaster.svelte";
    import { createToaster } from "@melt-ui/svelte";
    import {page} from '$app/stores';
    import { createContextMenu, melt } from '@melt-ui/svelte'
    import SearchGameModal from "../../../../../components/SearchGameModal.svelte";
    import { browser } from "$app/environment";
    import { base } from '$app/paths';
    // import EmptyList from "../../../../components/EmptyList.svelte";

    export let data;

    $: currentGame = {};
    $: showModal = false;

    // context menu
    const {
        elements: { menu, item, trigger, arrow }
    } = createContextMenu()

    function selectGame(game){
        currentGame = game;
    }

    // let totalPages = data.totalPages;
    $: currentPage = parseInt(data.page_num);
    $: query = data.search_query;


    let modalAddToList = (event) =>{
        if(data.userData == '00000000-0000-0000-0000-000000000000'){
            guestAddToList(event.detail);
        }
        else{
            addToList(event.detail);
        }
    }


//   if (data.userData == '00000000-0000-0000-0000-000000000000'){
//         let localExists;
//         if(browser)localExists = localStorage.getItem('guestGames');
//         if(localExists){
//             data.gameArray = localStorage.getItem('guestGames');
//         }
//     }

  // if the key is a guest key we store it using only the localStorage
  function guestAddToList(game){
        if (data.userData == '00000000-0000-0000-0000-000000000000'){
            let currentGames = [];
            game['title_genre'] = 'game';
            if(browser){
                
                // guestGameList.update((currentData) => {
                //     return [game, ...currentData];
                // })

                if(localStorage.getItem('guestGames')){
                    currentGames = JSON.parse(localStorage.getItem('guestGames'));
                    currentGames.push(game);
                    localStorage.setItem('guestGames', JSON.stringify(currentGames))
                }
                else{
                    localStorage.setItem('guestGames', JSON.stringify([game]))
                }

            }
        }
  }

    // we use the update function to let the store be updated
    function addToList(game) {
        game['title_genre'] = 'game'
        gameList.update((data) => {
            if ($gameList.length == 0) {
                if(localStorage.getItem("savedGames")){
                    let currentGames = localStorage.getItem("savedGames");
                    return [game, ... JSON.parse(currentGames)]
                }
                else{
                    localStorage.setItem('savedGames', JSON.stringify(game))
                    return [game, ... data]
                }
            }
            // const genreKey= 'title_genre';
            // game[genreKey] = 'game'
            return [game, ...data];
        });

        //get api key for the user to send request for auth
        let api_key = "";
        UserDataStore.subscribe((storeData) => {
            // check if this exists if not tell the user to login
            if (storeData.api_key) {
                api_key = storeData.api_key;
            } else {
                // addToast({
                //     data: {
                //         title: "Warning",
                //         description: "Please login to add titles!",
                //         color: "yellow",
                //     },
                //     closeDelay: 5000,
                //     type: "foreground",
                // });
            }
        });

        // send request to backend
        const gameListUnsub = gameList.subscribe(async (newTitle) => {
            const server_endpoint = "http://localhost:8200/games";
            let res = await fetch(server_endpoint, {
                method: "POST",
                body: JSON.stringify(newTitle),
                headers: {
                    "Content-type": "applicaiton/json",
                    Authorization:
                        "ApiKey " +
                        `${data.userData}`,
                },
            });

            const list_data = await res.json();

            if (res.status >= 400 && res.status < 500) {
                let update_errors = response?.error;

                // addToast({
                //     data: {
                //         title: "Error",
                //         description: update_errors,
                //         color: "red",
                //     },
                //     closeDelay: 5000,
                //     type: "foreground",
                // });
            }
            // this is needs to be error handled and displayed to the user
            // gets the correct errors already
        });

        onDestroy(gameListUnsub);
    }


    let gameStrLength;

    let toggleModal = (game) => {
        currentGame = game;
        gameStrLength = (currentGame.name).length
        showModal = !showModal;
    };

    let width;
</script>

<!-- <Header /> -->

<svelte:window bind:innerWidth={width} />
<!-- search bar -->
<div class="search-container" style="padding-top: 1.5rem; position:fixed; z-index:10;">
    {#if width >=1200}
        <a href="{base}/game-list" class="return-button"><Icon class="back-icon" icon="pixelarticons:arrow-left" /><p class="back-text">Back to List <p></a>
    {/if}
    <PageSearch titleGenre="game"/>
</div>
<div class="grid">
    {#if data.gameArray}
        {#each data.gameArray.results as game}
            <!-- {#if game.poster_path} -->
                <!-- <button class="add-button" on:click={addToList(movie)}><Icon icon="simple-line-icons:plus" /></button>   -->
                <div class="title-container" on:click={toggleModal(game)} on:contextmenu={selectGame(game)}  {...$trigger} use:trigger>
                    <Title title={game} titleGenre={"game"}/>
                </div>
            <!-- {/if} -->
        {/each}
    {/if}
    <div class="context-menu" {...$menu} use:menu>
        {#if (data.userData == '00000000-0000-0000-0000-000000000000')}
            <div {...$item} use:item style="color:springgreen; padding-bottom:10px;" on:click={guestAddToList(currentGame)}>Add to List</div>
        {:else if data.userData != '00000000-0000-0000-0000-000000000000'}
            <div {...$item} use:item style="color:springgreen; padding-bottom:10px;" on:click={addToList(currentGame)}>Add to List</div>
        {/if}
    </div>

    <SearchGameModal game={currentGame} windowWidth={width} titleLength={gameStrLength} on:addTitle={modalAddToList} bind:showModal />
    {#if width <= 415}
        <a href="{base}/game-list" class="return-button"><Icon class="back-icon" icon="pixelarticons:arrow-left" /></a>
    {/if}
</div>

<div class="pagination">
    <!-- {#each Array(totalPages) as _, idx} -->
    {#if currentPage > 1}
        <a
            class="previous-page block"
            href='{base}/game-list/search/{data.search_query}/{currentPage - parseInt('1')}'
            ><Icon
                style="font-size:2rem;"
                icon="emojione-monotone:left-arrow"
            /></a
        >
    {/if}
    <p class="page-num block">{currentPage}</p>
    <a
        class="next-page block"
        href="{base}/game-list/search/{data.search_query}/{currentPage + parseInt('1')}"
        ><Icon
            style="font-size:2rem;"
            icon="emojione-monotone:right-arrow"
        /></a
    >

    <!-- {/each} -->
</div>

<style>
    @import "../../../../../../styles.css";
    @font-face {
        src: url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,600;0,900;1,400;1,600;1,800;1,900&display=swap");
        font-family: "Rubik-Regular", sans-serif;
    }

    .context-menu{
    position: absolute;
    font-family:"DotGothic16", sans-serif;
    background-color: #181818;
    /* backdrop-filter: blur(1px); */
    padding:10px;
    border-radius: 5px;
    cursor: pointer;
  }

    .title-container {
        position: relative;
    }

    .add-button {
        border-radius: 8px;
        z-index: 1000;
        position: absolute;
        left: 4;
    }

    .page-num {
        padding: 0 20px 0 20px;
        font-size: 1.6rem;
        padding-top: 5px;
        color: wheat;
    }

    .next-page, .previous-page {
        padding-top: 9px;
        color: #5755FE;
    }

    .block {
        display: inline-block;
    }

    .pagination {
        text-align: center;
        background-color: #181818;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(2, 175px);
        grid-auto-rows: auto;
        justify-content: space-evenly;
        justify-items: center;
        padding: 1rem;
        background-color: #181818;
    }

    /* mobile styles */

    .search-container {
        display: grid;
        grid-auto-columns: auto;
        justify-content: center;
        width: 100%;
        background-color: #181818;
    }

    /* short ahhhh phone */
    @media screen and (min-height: 600px) {

        .grid {
            padding: 7rem 0.7rem 0rem;
        }

        .search-container {
            display: grid;
            grid-auto-columns: auto;
            justify-content: center;
            width: 100%;
            background-color: #181818;
            padding-bottom: 1.3rem;
            position: relative;
        }

        .return-button{
            position: fixed;
            bottom: 45px;
            left: 22px;
            background: #5755FE;
            font-size: 2rem;
            vertical-align: middle;
            border-radius: 10px;
            display: flex;
            align-items: center;
        }

        a :global(.back-icon) {
			font-size: 2rem;
		}
    }

    /* long ahhhh phone */
    @media screen and (min-height: 750px) {

        .grid {
            padding: 7rem 1.7rem 0rem;
        }

        .search-container {
            display: grid;
            grid-auto-columns: auto;
            justify-content: center;
            width: 100%;
            background-color: #181818;
            padding-bottom: 1.3rem;
            position: relative;
        }

        .return-button{
            position: fixed;
            bottom: 45px;
            left: 22px;
            background: #5755FE;
            font-size: 2rem;
            vertical-align: middle;
            border-radius: 10px;
            display: flex;
            align-items: center;
        }

        a :global(.back-icon) {
			font-size: 2rem;
		}
    }

    /* small tablet styles */
    @media screen and (min-width: 620px) {
    }

    /* large tablet & laptop styles */
    @media screen and (min-width: 960px) {
    }

    /* desktop styles */
    @media screen and (min-width: 1200px) {
        .grid {
            grid-template-columns: repeat(5, 1fr);
            grid-auto-rows: auto;
            padding: 2rem 6.7rem;
            padding-top: 7rem;
        }

        a :global(.back-icon) {
			font-size: 1.5rem;
		}

        .back-text{
            font-size: 1.25rem;
            font-family:"DotGothic16", sans-serif;
            padding-left: 10px;
            padding-right: 7px;
        }

        .search-container {
            display: grid;
            grid-auto-columns: auto;
            justify-content: center;
            width: 100%;
            background-color: #181818;
            padding-bottom: 2rem;
        }

        .return-button{
            position: absolute;
            top: 35px;
            left: 51px;
            padding: 12px;
            background: #5755FE;
            font-size: 2rem;
            vertical-align: middle;
            border-radius: 10px;
            display: flex;
            align-items: center;
        }
    }
</style>
