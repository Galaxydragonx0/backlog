<script>
    // @ts-nocheck

    import Icon from "@iconify/svelte";
    import Title from "../../../../../components/Title.svelte";
    import Search from "../../../../../components/Search.svelte";
    import PageSearch from "../../../../../components/PageSearch.svelte";
    import {showList, guestShowList} from "../../../../ShowStore";
    import UserDataStore from "../../../../UserDataStore";
    import { onDestroy } from "svelte";
    // import { addToast } from "../../../../../components/Toaster.svelte";
    import { createContextMenu, melt } from '@melt-ui/svelte'
    import SearchShowModal from "../../../../../components/SearchShowModal.svelte";
    import { browser } from "$app/environment";

    export let data;

    $: currentShow = {};
    $: showModal = false;

    // context menu
    const {
        elements: { menu, item, trigger, arrow }
    } = createContextMenu()

    function selectShow(show){
        currentShow = show;
    }

    let totalPages = data.totalPages;
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
//         if(browser)localExists = localStorage.getItem('guestShows');
//         if(localExists){
//             data.showArray = localStorage.getItem('guestShows');
//         }
//     }

  // if the key is a guest key we store it using only the localStorage
  function guestAddToList(show){
        if (data.userData == '00000000-0000-0000-0000-000000000000'){
            let currentShows = []
            show['title_genre'] = 'show';
            if(browser){
                
                // guestShowList.update((currentData) => {
                //     return [show, ...currentData];
                // })

                if(localStorage.getItem('guestShows')){
                    currentShows = JSON.parse(localStorage.getItem('guestShows'))
                    currentShows.push(show)
                    localStorage.setItem('guestShows', JSON.stringify(currentShows))
                }
                else{
                    localStorage.setItem('guestShows', JSON.stringify([show]))
                }
                
            }
        }
  }

    // we use the update function to let the store be updated
    function addToList(show) {
        show['title_genre'] = 'show';
        showList.update((data) => {
            if ($showList.length == 0) {
                let currentShows = localStorage.getItem("savedShows");
                return [show, ... JSON.parse(currentShows)]
            }
            // const genreKey= 'title_genre';
            // show[genreKey] = 'show'
            return [show, ...data];
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
        const showListUnsub = showList.subscribe(async (newTitle) => {
            const server_endpoint = "http://localhost:8200/shows";
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

        onDestroy(showListUnsub);
    }


    let showStrLength;

    let toggleModal = (show) => {
        currentShow = show;
        showStrLength = (currentShow.name).length
        showModal = !showModal;
    };

    let width;
</script>

<!-- <Header /> -->

<svelte:window bind:innerWidth={width} />
<!-- search bar -->
<div class="search-container" style="padding-top: 1.5rem; position:fixed; z-index:10;">
    {#if width >=1200}
        <a href="/show-list" class="return-button"><Icon class="back-icon" icon="pixelarticons:arrow-left" /><p class="back-text">Back to List <p></a>
    {/if}
    <PageSearch titleGenre="show"/>
</div>
<div class="grid">
    {#if data.showArray}
        {#each data.showArray as show}
            {#if show.poster_path}
                <!-- <button class="add-button" on:click={addToList(show)}><Icon icon="simple-line-icons:plus" /></button>   -->
                <div class="title-container" on:click={toggleModal(show)} on:contextmenu={selectShow(show)}  {...$trigger} use:trigger>
                    <Title title={show} titleGenre={'show'}/>
                </div>
            {/if}
        {/each}
    {/if}
    <div class="context-menu" {...$menu} use:menu>
        {#if (data.userData == '00000000-0000-0000-0000-000000000000')}
            <div {...$item} use:item style="color:springgreen; padding-bottom:10px;" on:click={guestAddToList(currentShow)}>Add to List</div>
        {:else if data.userData != '00000000-0000-0000-0000-000000000000'}
            <div {...$item} use:item style="color:springgreen; padding-bottom:10px;" on:click={addToList(currentShow)}>Add to List</div>
        {/if}
    </div>

    <SearchShowModal show={currentShow} windowWidth={width} titleLength={showStrLength} on:addTitle={modalAddToList} bind:showModal />
    {#if width <= 415}
        <a href="/show-list" class="return-button"><Icon class="back-icon" icon="pixelarticons:arrow-left" /></a>
    {/if}
</div>

<div class="pagination">
    <!-- {#each Array(totalPages) as _, idx} -->
    {#if currentPage > 1}
        <a
            class="previous-page block"
            href="/show-list/search/{query}/{currentPage - parseInt('1')}"
            ><Icon
                style="font-size:2rem;"
                icon="emojione-monotone:left-arrow"
            /></a
        >
    {/if}
    <p class="page-num block">{currentPage}</p>
    <a
        class="next-page block"
        href="/show-list/search/{query}/{currentPage + parseInt('1')}"
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
        color: #ff5200;
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
            background: #ff5200;
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
            background: #ff5200;
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
            background: #ff5200;
            font-size: 2rem;
            vertical-align: middle;
            border-radius: 10px;
            display: flex;
            align-items: center;
        }
    }
</style>
