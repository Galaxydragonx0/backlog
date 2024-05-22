<script>
    // @ts-nocheck

    import Header from "../../../components/Header.svelte";
    import Search from "../../../components/Search.svelte";
</script>

<!-- <Header /> -->

<div class="search-container">
    <h1 class="genre">Movies</h1>
    <Search titleGenre={'movie'} />


</div>
<style>
    @import "../../../../styles.css";
    @font-face{
		font-family: 'header-font';
		src: url('../../assets/fonts/PublicPixel.ttf')
	}
    @font-face {
        src: url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,600;0,900;1,400;1,600;1,800;1,900&display=swap");
        font-family: "Rubik-Regular", sans-serif;
    }

    /* mobile styles */
    .search-container {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: repeat(10, 1fr);
        /* justify-content: center; */
        align-items: center;
        justify-items: center;
        padding-top: 1.5rem;
        /* height: calc(100vh - 96px); */
        background-color: #181818;
    }

    .genre{
        grid-column: 1 / -1;
        grid-row: 3;
        font-size: 2.5rem;
        font-family: 'header-font';
        color: springgreen;
    }


    /* short ahhhh phone */
    @media screen and (min-height: 600px) {
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
        .search-container {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: repeat(10, 1fr);
        /* justify-content: center; */
        align-items: center;
        justify-items: center;
        padding-top: 1.5rem;
        height: 97.5vh;
        background-color: #181818;
    }

    .genre{
        grid-column: 1 / -1;
        grid-row: 3;
        font-size: 3rem;
        font-family: 'header-font';
        color: springgreen;
    }

    }
</style>
