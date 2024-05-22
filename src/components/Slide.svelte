<div
class="embla"
use:emblaCarouselSvelte={{ options }}
on:emblaInit={onInit}
on:emblaScrollNext={scrollNext}
>
<div class="embla__container">
  {#each movieListItems as movie}
    <div class="embla__slide" style="">
      <div class="bg-img">
        <img
          class="bg-poster-img"
          alt="movie-poster"
          src="https://image.tmdb.org/t/p/original/{movie.poster_path}"
        />
      </div>
      <div class="info">
        <h2 class="title-name">{movie.title}</h2>
        <p class="title-overview">{movie.overview}</p>

        <!-- <form action="?/remove"> -->
        <button
          class="remove"
          on:click={() => {removeTitle(movie?.id, true)}}>remove</button
        >
        <!-- </form> -->
        <!-- <form action="?/completed"> -->
        <button
          class="completed"
          on:click={() => {completedTitle(movie)}}>mark as complete</button
        >
      <!-- </form> -->
      </div>
    </div>
  {/each}
</div>
<button
  class="embla__prev"
  style="color: springgreen;font-size: 2rem;position: absolute;top: 48%;left: 1rem;"
  on:click={scrollPrev}
  ><Icon icon="emojione-monotone:left-arrow" /></button
>
<button
  class="embla__next"
  style="color: springgreen;font-size: 2rem;position: absolute;top: 48%;right: 1rem;"
  on:click={scrollNext}
  ><Icon icon="emojione-monotone:right-arrow" /></button
>
</div>


<style>

@import url("https://fonts.googleapis.com/css2?family=DotGothic16&display=swap");
  @font-face {
    src: url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,600;0,900;1,400;1,600;1,800;1,900&display=swap");
    font-family: "Rubik-Regular", sans-serif;
  }

  @font-face{
		font-family: 'header-font';
		src: url('../../static/fonts/PublicPixel.ttf');
	}



  .embla {
    overflow: hidden;
    background: #181818;
  }
  .embla__container {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 100%; /* Each slide covers 100% of the viewport */
  }


  .embla__slide {
    height: 100vh;
    justify-content: center;
    align-items: center;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: repeat(5, 1fr);
    color: wheat;
    background-size: 100%;
    /* -webkit-backdrop-filter: blur(10px) saturate(180%); */
    backdrop-filter: blur(10px) saturate(1);
    /* background-color: rgba(255,255,255,.5);
    border-radius: 1rem;
    box-shadow: 0 1rem 2rem rgba(0,0,0,.3); */
  }


  .avatar {
    vertical-align: middle;
    border-radius: 50%;
    border: 2px solid black;
  }

  .title-name {
    grid-column: 1 / -1;
    grid-row: 2;
    text-align: center;
    font-style: oblique;
    font-family: "DotGothic16", sans-serif;
    font-weight: 400;
    z-index: 2;
    padding: 0.4rem;
  }

  .title-overview {
    grid-column: 1 / -1;
    grid-row: 3 / 7;
    padding: 1rem;
    font-family: "DotGothic16", sans-serif;
    font-weight: 400;
    font-style: normal;
    z-index: 2;
  }

  .remove {
    grid-row: 4 / 7;
    grid-column: 1 / 2;
    position: absolute;
    left: 1.5rem;
  }


  .info {
    position: absolute;
    bottom: 0rem;
    border-radius: 10px;
    background-size: 100%;
    grid-column: 4;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: repeat(10, 1fr);
    display: grid;
    grid-column: 1/-1;
    grid-row: 1/-1;
    height: 50vh;
    backdrop-filter: blur(35px) saturate(1);
    background: linear-gradient(351deg, transparent, black);
    width: 100%;
  }



  .image {
    margin: 1rem;
    border-radius: 10px;
    grid-column: 1/-1;
    grid-row: 1;
    width: 95vw;
    z-index: 2;
  }


  .bg-img {
    grid-column: 1/-1;
    grid-row: 1;
    opacity: 0.3;
    z-index: 0;
  }

  .bg-poster-img {
    width: 100vw;
  }

  body {
    margin: 0;
  }

</style>