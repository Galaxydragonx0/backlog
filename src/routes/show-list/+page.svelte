<script>
  // @ts-nocheck
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";
  import { showList } from "../ShowStore";
  import { authUser } from "$lib/firebase/auth";
  import { subscribeList, removeItem, completeItem } from "$lib/firebase/db";
  import Icon from "@iconify/svelte";
  import Title from "../../components/Title.svelte";
  import ModalTwo from "../../components/ModalTwo.svelte";
  import SignInGate from "../../components/SignInGate.svelte";
  import { createContextMenu } from "@melt-ui/svelte";
  import { fade, blur } from "svelte/transition";
  import { base } from "$app/paths";

  $: showListItems = $showList;
  let currentShow = {};
  let showModal = false;
  let showStrLength;
  let width;

  // Live-sync this user's shows from Firestore (offline-cached).
  let unsub;
  $: if (browser) {
    if ($authUser) {
      unsub?.();
      unsub = subscribeList($authUser.uid, "shows", (items) => showList.set(items));
    } else if ($authUser === null) {
      unsub?.();
      unsub = undefined;
      showList.set([]);
    }
  }
  onDestroy(() => unsub?.());

  const {
    elements: { menu, item, trigger },
  } = createContextMenu();

  function toggleModal(show) {
    currentShow = show;
    showStrLength = currentShow.title?.length;
    showModal = !showModal;
  }

  function selectShow(show) {
    currentShow = show;
  }

  const modalRemove = (event) => {
    showModal = false;
    if ($authUser) removeItem($authUser.uid, "shows", event.detail);
  };

  const modalComplete = (event) => {
    if ($authUser) completeItem($authUser.uid, "shows", event.detail);
  };

  function removeTitle(id) {
    if ($authUser) removeItem($authUser.uid, "shows", id);
  }

  function completedTitle(show) {
    if ($authUser) completeItem($authUser.uid, "shows", show);
  }
</script>

<svelte:window bind:innerWidth={width} />
<div class="ovr-container">
  <div class="genre-container">
    {#if width >= 1200}
      <a href="{base}/list-menu" class="return-button"
        ><Icon class="back-icon" icon="pixelarticons:arrow-left" />
        <p class="back-text">Back to Menu</p></a
      >
    {:else}
    <a href="{base}/list-menu" class="return-button"
      ><Icon class="back-icon" icon="pixelarticons:arrow-left" /></a
    >
    {/if}
    <h1 class="genre">My</h1>
    <h1 class="genre">Shows</h1>
  </div>

  {#if browser}
    {#if $authUser === null}
      <SignInGate message="Sign in to view and sync your shows." />
    {:else if $authUser}
      {#if showListItems && showListItems.length > 0 && showListItems[0] != null}
        <div class="movie-grid">
          {#each showListItems as show (show.id)}
            <div
              out:blur|global
              in:fade|global
              on:click={toggleModal(show)}
              on:contextmenu={selectShow(show)}
              {...$trigger}
              use:trigger
            >
              <Title title={show} titleGenre={"show"} />
            </div>
          {/each}
        </div>

        <div class="context-menu" {...$menu} use:menu>
          <div
            {...$item}
            use:item
            style="color:springgreen; padding-bottom:10px; cursor:pointer;"
            on:click={completedTitle(currentShow)}
          >
            Mark as Complete
          </div>
          <div
            {...$item}
            use:item
            style="color:red; cursor:pointer;"
            on:click={removeTitle(currentShow.id)}
          >
            Remove Title
          </div>
        </div>
      {:else}
        <div class="empty-container">
          <p class="message">
            If you add a CW show, you should pay me for this app (I don't judge
            tho)
          </p>
          <a class="search-link" href="{base}/show-list/search">Try adding some shows here => </a>
        </div>
      {/if}

      <ModalTwo
        title={currentShow}
        titleGenre={"show"}
        windowWidth={width}
        titleLength={showStrLength}
        on:completeTitle={modalComplete}
        on:removeTitle={modalRemove}
        bind:showModal
      />

      <a href="{base}/show-list/search/"
        ><button class="add-movie"><Icon icon="mdi:plus" /></button></a
      >
    {/if}
  {/if}
</div>

<style lang="postcss">
  @import url("https://fonts.googleapis.com/css2?family=DotGothic16&display=swap");
  @font-face {
    src: url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,600;0,900;1,400;1,600;1,800;1,900&display=swap");
    font-family: "Rubik-Regular", sans-serif;
  }

  @font-face {
    font-family: "header-font";
    src: url("../../static/fonts/PublicPixel.ttf");
  }

  .add-movie {
    cursor: pointer;
    color: #181818;
    font-size: 2rem;
    background-color: #ff5200;
    border-radius: 36px;
    position: fixed;
    bottom: calc(1rem + var(--safe-bottom, env(safe-area-inset-bottom, 0px)));
    right: 2rem;
    z-index: 10;
    box-shadow:
      0 8px 16px 0 rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .empty-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(2, 1fr);
    justify-items: center;
    color: springgreen;
    font-family: "DotGothic16", sans-serif;
    margin-top: 9rem;
  }

  .message {
    grid-column: 1/-1;
    grid-row: 1;
  }
  .search-link {
    grid-column: 1 / -1;
    grid-row: 2;
    margin-top: 4rem;
    padding: 10px;
    color: red;
    border-radius: 9px;
    background: midnightblue;
  }

  .movie-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: auto;
    justify-items: center;
    padding: 10px;
  }

  .genre {
    grid-column: 5 / 10;
    grid-row: 3;
    font-size: 2rem;
    font-family: "header-font";
    color: #ff5200;
    margin: 0;
  }

  .ovr-container {
    background: #181818;
    padding: 0.7rem;
    overflow: auto;
    height: 100dvh;
  }

  .genre-container {
    padding: 1rem 0 2rem 0rem;
    line-height: normal;
  }

  .context-menu {
    font-family: "DotGothic16", sans-serif;
    background-color: #181818;
    padding: 10px;
    border-radius: 5px;
  }

  a:visited {
    text-decoration: none;
  }

  .backdrop {
    width: 100%;
    height: 15rem;
    background: rgba(0, 0, 0, 0.8);
  }
  .modal {
    padding: 10px;
    height: 100%;
    text-align: center;
    background: white;
    overflow-y: auto;
  }

  /* mobile styles */
  .title {
    height: 10%;
    width: 100%;
  }

  .modal {
    overflow-x: hidden;
  }

  /* short ahhhh phone */
  @media screen and (min-height: 600px) {
    .genre-container {
      padding: 2rem 0 3rem 1rem;
      line-height: normal;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      position: relative;
    }

    .return-button {
      position: absolute;
      top: 64px;
      left: 29px;
      background: #ff5200;
      font-size: 2rem;
      vertical-align: middle;
      border-radius: 10px;
      display: flex;
      align-items: center;
    }

    a :global(.back-icon) {
      font-size: 1.75rem;
    }
  }

  /* long ahhhh phone */
  @media screen and (min-height: 750px) {
    .genre-container {
      padding: 2rem 0 3rem 1rem;
      line-height: normal;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      position: relative;
    }

    .return-button {
      position: absolute;
      top: 64px;
      left: 29px;
      background: #ff5200;
      font-size: 2rem;
      vertical-align: middle;
      border-radius: 10px;
      display: flex;
      align-items: center;
    }

    a :global(.back-icon) {
      font-size: 1.75rem;
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
    .ovr-container {
      background: #181818;
      padding: 2rem 6.7rem;
      overflow: auto;
      height: calc(100dvh - 64px);
    }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-auto-rows: auto;
      justify-items: center;
    }

    .genre {
      font-size: 3rem;
      font-family: "header-font";
      color: #ff5200;
      margin: 0;
    }

    .genre-container {
      padding: 2rem 0 3rem 1rem;
      line-height: normal;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      position: relative;
    }

    .back-text {
      font-size: 1.25rem;
      font-family: "DotGothic16", sans-serif;
      padding-left: 10px;
      padding-right: 7px;
      margin: 0px;
    }

    .return-button {
      position: absolute;
      top: 38%;
      left: 29px;
      height: 3rem;
      background: #ff5200;
      font-size: 2rem;
      vertical-align: middle;
      border-radius: 10px;
      display: flex;
      align-items: center;
    }

    a :global(.back-icon) {
      font-size: 1.5rem;
    }

    .add-movie:hover {
      box-shadow:
        0 12px 16px 0 rgba(0, 0, 0, 0.24),
        0 17px 50px 0 rgba(0, 0, 0, 0.19);
    }
  }
</style>
