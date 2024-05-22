<script>
    // @ts-nocheck
    import Icon from "@iconify/svelte";
    import { createEventDispatcher } from "svelte";

    export let title;
    export let titleGenre;

    const dispatch = createEventDispatcher();
    function getData() {
        dispatch("getData", title);
    }

    let width;
</script>

<svelte:window bind:innerWidth={width} />
<div class="poster-container">
    {#if titleGenre == "movie"}
        <img
            alt="movie-poster"
            class="poster-image"
            src="https://image.tmdb.org/t/p/w185/{title.poster_path}"
        />
        <p class="img-desc">{title.title}</p>
    {/if}
    {#if titleGenre == "game"}
        <img
            alt="movie-poster"
            class="poster-image"
            src="{title.image.small_url}"
        />
        <p class="img-desc" style="color: rgb(115 112 255);">{title.name}</p>
    {/if}
    {#if titleGenre == "book"}
        {#if width >= 1200}
            <img
                style="height: 19rem; width:14rem"
                alt="movie-poster"
                class="poster-image"
                src="https://books.google.com/books?id={title.id}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            />
        {:else}
                <img
                alt="movie-poster"
                class="poster-image"
                src="https://books.google.com/books?id={title.id}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            />
        {/if}
        <p class="img-desc" style="color: #f1dd00;">{title.volumeInfo.title}</p>
    {/if}
    {#if titleGenre == "show"}
        <img
            alt="movie-poster"
            class="poster-image"
            src="https://image.tmdb.org/t/p/w185/{title.poster_path}"
        />
        <p class="img-desc" style="color: rgb(255 108 39 / 97%);">{title.name}</p>
    {/if}
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=DotGothic16&display=swap");
    @font-face {
        src: url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,600;0,900;1,400;1,600;1,800;1,900&display=swap");
        font-family: "Rubik-Regular", sans-serif;
    }

    .img-desc {
        visibility: hidden;
        display: none;
    }

    .poster-container:hover .img-desc {
        visibility: visible;
        opacity: 1;
    }

    .poster-container {
        position: relative;
        margin-bottom: 1rem;
        grid-template-columns: repeat(3, 1fr);
        display: grid;
        justify-items: center;
    }

    .poster-image {
        display: block;
        height: 224px;
        border-radius: 10px;
        width: 159px;
        grid-column: 1 / -1;
    }

    .add-button {
        border-radius: 8px;
        z-index: 1000;
        position: absolute;
        left: 4;
        background-color: lightgrey;
        font-size: larger;
    }

    .title-name {
        display: block;
        margin-top: -8px;
        max-width: 10.3rem;
        min-height: 6rem;
        font-family: "Rubik-Regular", sans-serif;
        font-size: 0.9rem;
    }

    @media screen and (min-height: 600px) {
        .poster {
            height: 228px;
            border: 4px solid;
            width: 159px;
        }
    }

    /* long ahhhh phone */
    @media screen and (min-height: 750px) {
    }

    /* small tablet styles */
    @media screen and (min-width: 620px) {
    }

    /* large tablet & laptop styles */
    @media screen and (min-width: 960px) {
    }

    /* desktop styles */
    @media screen and (min-width: 1200px) {
        .poster-image {
            /* display: block; */
            transition: transform 0.4s ease-in-out;
            height: 29rem;
            width: 20rem;
            grid-column: 1 / -1;
        }

        .poster-container .poster-image:hover {
            transform: scale(1.05);
        }

        .img-desc {
            position: absolute;
            bottom: 10px;
            background: none;
            backdrop-filter: blur(1.5px);
            background-color: #181818;
            color: springgreen;
            visibility: hidden;
            text-align: center;
            opacity: 0;
            font-family: "DotGothic16", sans-serif;
            transition:
                opacity 0.2s,
                visibility 0.2s;
            grid-column: 1 / -1;
            padding: 5px;
            border-radius: 5px;
            visibility: visible;
            display: inline;
        }
    }
</style>
