<script>
    // @ts-nocheck

    import Icon from "@iconify/svelte";
    // import Header from "../../../../components/Header.svelte";
    import Title from "../../../../../components/Title.svelte";
    import PageSearch from "../../../../../components/PageSearch.svelte";
    import {movieList, guestMovieList} from "../../../../MovieStore";
    import UserDataStore from "../../../../UserDataStore";
    import { onDestroy } from "svelte";
    // import { addToast } from "../../../../../components/Toaster.svelte";
    import { createToaster } from "@melt-ui/svelte";
    import {page} from '$app/stores';
    import { createContextMenu, melt } from '@melt-ui/svelte'
    import SearchMovieModal from "../../../../../components/SearchMovieModal.svelte";
    import { browser } from "$app/environment";
    import { base } from '$app/paths';

    export let data;

    $: currentMovie = {};
    $: showModal = false;

    // context menu
    const {
        elements: { menu, item, trigger, arrow }
    } = createContextMenu()

    function selectMovie(movie){
        currentMovie = movie;
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
//         if(browser)localExists = localStorage.getItem('guestMovies');
//         if(localExists){
//             data.movieArray = localStorage.getItem('guestMovies');
//         }
//     }

  // if the key is a guest key we store it using only the localStorage
  function guestAddToList(movie){
        if (data.userData == '00000000-0000-0000-0000-000000000000'){
            let currentMovies = []
            movie['title_genre'] = 'movie';
            if(browser){

                // guestMovieList.update((currentData) => {
                //     return [movie, ...currentData];
                // })

                if(localStorage.getItem('guestMovies')){
                    currentMovies = JSON.parse(localStorage.getItem('guestMovies'));
                    currentMovies.push(movie);
                    localStorage.setItem('guestMovies', JSON.stringify(currentMovies))
                }
                else{
                    localStorage.setItem('guestMovies', JSON.stringify([movie]))
                }
                
            }

                // addToast({
                //     data: {
                //         title: "Success",
                //         description: "Add movie to your list",
                //         color: "green",
                //     },
                //     closeDelay: 5000,
                //     type: "foreground",
                // });
        }
  }

    // we use the update function to let the store be updated
    function addToList(movie) {
        movie['title_genre'] = 'movie';
        movieList.update((data) => {
            if ($movieList.length == 0) {
                let currentMovies = localStorage.getItem("savedMovies");
                return [movie, ... JSON.parse(currentMovies)]
            }
            // const genreKey= 'title_genre';
            // movie[genreKey] = 'movie'
            return [movie, ...data];
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
        const movieListUnsub = movieList.subscribe(async (newTitle) => {
            const server_endpoint = "http://localhost:8200/movies";
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
            
            if(res.status == 200){
                // addToast({
                //     data: {
                //         title: "Success",
                //         description: "Add movie to your list",
                //         color: "green",
                //     },
                //     closeDelay: 5000,
                //     type: "foreground",
                // });
            }
        });

        onDestroy(movieListUnsub);
    }


    let movieStrLength;

    let toggleModal = (movie) => {
        currentMovie = movie;
        movieStrLength = (currentMovie.title).length
        showModal = !showModal;
    };

    let width;
</script>

<!-- <Header /> -->

<svelte:window bind:innerWidth={width} />
<!-- search bar -->

<div class="search-container" style="padding-top: 1.5rem; position:fixed; z-index:10;">
    {#if width >=1200}
        <a href="{base}/movie-list" class="return-button"><Icon class="back-icon" icon="pixelarticons:arrow-left" /><p class="back-text">Back to List <p></a>
    {/if}
    <PageSearch titleGenre="movie"/>
</div>

<div class="grid">
    {#if data.movieArray}
        {#each data.movieArray as movie}
            {#if movie.poster_path}
                <!-- <button class="add-button" on:click={addToList(movie)}><Icon icon="simple-line-icons:plus" /></button>   -->
                <div class="title-container" on:click={toggleModal(movie)} on:contextmenu={selectMovie(movie)}  {...$trigger} use:trigger>
                    <Title title={movie} titleGenre={'movie'}/>
                </div>
            {/if}
        {/each}
    {/if}
    <div class="context-menu" {...$menu} use:menu>
        {#if (data.userData == '00000000-0000-0000-0000-000000000000')}
            <div {...$item} use:item style="color:springgreen; padding-bottom:10px;" on:click={guestAddToList(currentMovie)}>Add to List</div>
        {:else if data.userData != '00000000-0000-0000-0000-000000000000'}
            <div {...$item} use:item style="color:springgreen; padding-bottom:10px;" on:click={addToList(currentMovie)}>Add to List</div>
        {/if}
    </div>

    <SearchMovieModal movie={currentMovie} windowWidth={width} titleLength={movieStrLength} on:addTitle={modalAddToList} bind:showModal />
    {#if width <= 415}
        <a href="{base}/movie-list" class="return-button"><Icon class="back-icon" icon="pixelarticons:arrow-left" /></a>
    {/if}
</div>

<div class="pagination">
    <!-- {#each Array(totalPages) as _, idx} -->
    {#if currentPage > 1}
        <a
            class="previous-page block"
            href="{base}/movie-list/search/{query}/{currentPage - parseInt('1')}"
            ><Icon
                style="font-size:2rem;"
                icon="emojione-monotone:left-arrow"
            /></a
        >
    {/if}
    <p class="page-num block">{currentPage}</p>
    <a
        class="next-page block"
        href="{base}/movie-list/search/{query}/{currentPage + parseInt('1')}"
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

    /* .return-button{
        position: absolute;
        top: 35px;
        left: 51px;
        background: springgreen;
        font-size: 2rem;
        vertical-align: middle;
        border-radius: 10px;
        display: flex;
        align-items: center;
    } */

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
        color: springgreen;
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
        padding-top: 5rem;
    }

    /* mobile styles */

    .search-container {
        display: grid;
        grid-auto-columns: auto;
        justify-content: center;
        width: 100%;
        background-color: #181818;
        padding-bottom: 2rem;
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
            background: springgreen;
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
            background: springgreen;
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
            background: springgreen;
            font-size: 2rem;
            vertical-align: middle;
            border-radius: 10px;
            display: flex;
            align-items: center;
        }
    }
</style>
