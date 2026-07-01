<script>
  // @ts-nocheck
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";
  import { bookList } from "../BookStore";
  import { authUser } from "$lib/firebase/auth";
  import { subscribeList, removeItem, completeItem } from "$lib/firebase/db";
  import { showToast } from "$lib/toast";
  import Icon from "@iconify/svelte";
  import Title from "../../components/Title.svelte";
  import ModalTwo from "../../components/ModalTwo.svelte";
  import SignInGate from "../../components/SignInGate.svelte";
  import { createContextMenu } from "@melt-ui/svelte";
  import { fade, blur } from "svelte/transition";
  import { base } from "$app/paths";

  $: bookListItems = $bookList;
  let currentBook = {};
  let showModal = false;
  let bookStrLength;
  let width;

  // Live-sync this user's books from Firestore (offline-cached).
  let unsub;
  $: if (browser) {
    if ($authUser) {
      unsub?.();
      unsub = subscribeList($authUser.uid, "books", (items) => bookList.set(items));
    } else if ($authUser === null) {
      unsub?.();
      unsub = undefined;
      bookList.set([]);
    }
  }
  onDestroy(() => unsub?.());

  const {
    elements: { menu, item, trigger },
  } = createContextMenu();

  function toggleModal(book) {
    currentBook = book;
    bookStrLength = currentBook.title?.length;
    showModal = !showModal;
  }

  function selectBook(book) {
    currentBook = book;
  }

  const modalRemove = (event) => {
    showModal = false;
    if ($authUser) {
      removeItem($authUser.uid, "books", event.detail);
      showToast("Title removed");
    }
  };

  const modalComplete = (event) => {
    showModal = false;
    if ($authUser) {
      completeItem($authUser.uid, "books", event.detail);
      showToast("Marked as complete");
    }
  };

  function removeTitle(id) {
    if ($authUser) {
      removeItem($authUser.uid, "books", id);
      showToast("Title removed");
    }
  }

  function completedTitle(book) {
    if ($authUser) {
      completeItem($authUser.uid, "books", book);
      showToast("Marked as complete");
    }
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
    <h1 class="genre">Books</h1>
  </div>

  {#if browser}
    {#if $authUser === null}
      <SignInGate message="Sign in to view and sync your books." />
    {:else if $authUser}
      {#if bookListItems && bookListItems.length > 0 && bookListItems[0] != null}
        <div class="movie-grid">
          {#each bookListItems as book (book.id)}
            <div
              out:blur|global
              in:fade|global
              on:click={toggleModal(book)}
              on:contextmenu={selectBook(book)}
              {...$trigger}
              use:trigger
            >
              <Title title={book} titleGenre={"book"} />
            </div>
          {/each}
        </div>

        <div class="context-menu" {...$menu} use:menu>
          <div
            {...$item}
            use:item
            style="color:springgreen; padding-bottom:10px; cursor:pointer;"
            on:click={completedTitle(currentBook)}
          >
            Mark as Complete
          </div>
          <div
            {...$item}
            use:item
            style="color:red; cursor:pointer;"
            on:click={removeTitle(currentBook.id)}
          >
            Remove Title
          </div>
        </div>
      {:else}
        <div class="empty-container">
          <p class="message">library's empty right now</p>
          <a class="search-link" href="{base}/book-list/search">Try adding some books here => </a>
        </div>
      {/if}

      <ModalTwo
        title={currentBook}
        titleGenre={"book"}
        windowWidth={width}
        titleLength={bookStrLength}
        on:completeTitle={modalComplete}
        on:removeTitle={modalRemove}
        bind:showModal
      />

      <a href="{base}/book-list/search/"
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
    src: url('../../static/fonts/PublicPixel.ttf');
  }

  .add-movie {
    cursor: pointer;
    color: #181818;
    font-size: 2rem;
    background-color: #f1dd00;
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
    gap: 1.5rem 1rem;
    padding: 10px;
  }

  .genre {
    grid-column: 5 / 10;
    grid-row: 3;
    font-size: 2rem;
    font-family: "header-font";
    color: #f1dd00;
    margin: 0;
  }

  .ovr-container {
    background: #181818;
    padding: 0.7rem;
    height: 100dvh;
    overflow: auto;
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
      background: #f1dd00;
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
      background: #f1dd00;
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
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: auto;
      justify-items: center;
      gap: 2rem 1.5rem;
    }

    .genre {
      font-size: 3rem;
      font-family: "header-font";
      color: #f1dd00;
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
      background: #f1dd00;
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
