<script>
    // @ts-nocheck
    import { goto } from "$app/navigation";
    import Icon from "@iconify/svelte";

    export let titleGenre = '';

    let searchValue = "";
    let pageNum = "1";
    const handleSearch = () => {

            switch(titleGenre){
                case 'movie':
                goto(`/movie-list/search/${searchValue}/${pageNum}`);
                break;
                case 'game':
                goto(`/game-list/search/${searchValue}/${pageNum}`);
                break;
                case 'show':
                goto(`/show-list/search/${searchValue}/${pageNum}`);
                break;
                case 'book':
                goto(`/book-list/search/${searchValue}/${pageNum}`);
                break;
            }
        
        
    }
</script>


<!-- search bar -->
<form class="search-bar" on:submit|preventDefault={() => handleSearch}>
    <input class="bar" type="text" bind:value={searchValue} />
    {#if titleGenre == "movie"}
        <button class="search-button" type="submit" on:click={() => handleSearch()}>
            <Icon icon="pixelarticons:search" />
        </button>
    {/if}
    {#if titleGenre == "show"}
    <button class="search-button" style="color: #ff5200;" type="submit" on:click={() => handleSearch()}>
        <Icon icon="pixelarticons:search" />
    </button>
    {/if}
    {#if titleGenre == "book"}
    <button class="search-button" style="color: #f1dd00;" type="submit" on:click={() => handleSearch()}>
        <Icon icon="pixelarticons:search" />
    </button>
    {/if}
    {#if titleGenre == "game"}
    <button class="search-button" style="color: #5755FE;" type="submit" on:click={() => handleSearch()}>
        <Icon icon="pixelarticons:search" />
    </button>
    {/if}
</form>

<style>
    .search-bar {
        grid-column: 1 / -1;
        grid-row: 4;
        position: relative;
    }

    .search-button {
        all: unset;
        min-height: 2.84rem;
        position: absolute;
        font-size: 2.3rem;
        right: 1rem;
        top: 23.5rem;
        color: springgreen;
    }

    .bar {
        min-width: 21rem;
        min-height: 2.5rem;
        border-radius: 10px;
        background-color: black;
        color: springgreen;
        font-family: "DotGothic16";
        letter-spacing: 0.1rem;
        padding: 0 5px 0 5px;
        margin-left: -1rem;
    }

    /* short ahhhh phone */
    @media screen and (min-height: 600px) {

        .search-bar {
            grid-column: 1 / 12;
            grid-row: 4;
            position: relative;
        }

        
        .search-button {
            all: unset;
            min-height: 2.84rem;
            position: absolute;
            font-size: 2rem;
            top: -3px;
            /* right: -2.55rem; */
            color: springgreen;
        }

        .bar {
            min-width: 18rem;
            min-height: 2.5rem;
            border-radius: 10px;
            background-color: black;
            color: springgreen;
            font-family: "DotGothic16";
            letter-spacing: 0.1rem;
            padding: 0 5px 0 5px;
            margin-left: -23px;
        }
    }

    /* long ahhhh phone */
    @media screen and (min-height: 750px) {
        .search-bar {
            grid-column: 1 / 12;
            grid-row: 4;
            position: relative;
        }
        .search-button {
            all: unset;
            min-height: 2.84rem;
            position: absolute;
            font-size: 2.3rem;
            top: -3px;
            /* right: -2.55rem; */
            color: springgreen;
        }

        .bar {
            min-width: 20rem;
            min-height: 2.5rem;
            border-radius: 10px;
            background-color: black;
            color: springgreen;
            font-family: "DotGothic16";
            letter-spacing: 0.1rem;
            padding: 0 5px 0 5px;
            margin-left: -29px;
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
        .search-bar {
            grid-column: 1/-1;
            grid-row: 4;
            position: relative;
        }

        .search-button {
            all: unset;
            min-height: 1.84rem;
            position: absolute;
            font-size: 2.3rem;
            padding-left: 0.5rem;
            color: springgreen;
        }

        .bar {
            min-width: 30rem;
            min-height: 2.5rem;
            border-radius: 10px;
            background-color: black;
            color: springgreen;
            font-family: "DotGothic16";
            letter-spacing: 0.1rem;
            padding: 0 5px 0 5px;
            margin: 0;
        }
    }
</style>
