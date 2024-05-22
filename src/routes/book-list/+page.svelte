<script>
  // @ts-nocheck
  import { browser } from "$app/environment";
  import emblaCarouselSvelte from "embla-carousel-svelte";
  import { bookList, guestBookList } from "../BookStore";
  import UserDataStore from "../UserDataStore";
  // import { addToast } from "../../components/Toaster.svelte";
  import Icon from "@iconify/svelte";
  import { CompletedStore, guestCompletedStore } from "../CompletedTitleStore";
  import { page } from "$app/stores";
  import Title from "../../components/Title.svelte";
  import ModalTwo from "../../components/ModalTwo.svelte";
  import { createContextMenu, melt, createTooltip } from "@melt-ui/svelte";
  import { fade, blur } from "svelte/transition";

  export let data;

  $: userData = $UserDataStore;
  $: bookListItems = $bookList;
  $: guestBookListItems = $guestBookList;
  $: currentBook = {};
  $: showModal = false;

  let bookStrLength;

  // if the user is a guest we neeed to load the appropriate lists
  if (data.api_key == "00000000-0000-0000-0000-000000000000" && !data.books) {
    guestBookList.update(() => {
      if (browser) {
        // takes the saved local storage and updates the guest list to that
        let savedBooks = JSON.parse(window.localStorage.getItem("guestBooks"));
        return savedBooks;
      }
    });
    guestBookListItems = $guestBookList;
  } else if (data.books) {
    bookListItems = data.books;
  }

  // context menu
  const {
    elements: { menu, item, trigger },
  } = createContextMenu();

  let toggleModal = (book) => {
    currentBook = book;
    bookStrLength = currentBook.volumeInfo.title.length;
    showModal = !showModal;
  };

  // adds list to localstorage for backup
  bookList.update(() => {
    if (browser) {
      window.localStorage.setItem("savedBooks", JSON.stringify(data.books));
    }
    return data.books;
  });

  function selectBook(book) {
    currentBook = book;
  }

  async function guestRemoveTitle(id, showToast) {
    try {
      let updatedBookList = guestBookListItems.filter((obj) => obj.id !== id);
      guestBookList.update(() => {
        if (browser) {
          window.localStorage.setItem(
            "guestBooks",
            JSON.stringify(updatedBookList),
          );
        }
        return updatedBookList;
      });

      if (showToast) {
        // addToast({
        //   data: {
        //     title: "Success",
        //     description: "The title was removed!",
        //     color: "green",
        //   },
        //   closeDelay: 5000,
        //   type: "foreground",
        // });
      }
    } catch (error) {
      // addToast({
      //   data: {
      //     title: "Error",
      //     description: "The title was not removed!",
      //     color: "red",
      //   },
      //   closeDelay: 5000,
      //   type: "foreground",
      // });
    }
  }

  async function guestCompletedTitle(title) {
    try {
      // add the title to the completed list
      if (browser) {
        var localExists = JSON.parse(
          window.localStorage.getItem("guestCompletedTitles"),
        );

        // get localstorage data into store if it exists
        if (localExists != null) {
          guestCompletedStore.update(() => {
            return [];
          });

          if (localExists instanceof Array) {
            guestCompletedStore.set(
              JSON.parse(window.localStorage.getItem("guestCompletedTitles")),
            );
            guestCompletedStore.update((data) => {
              return [title, ...data];
            });
          } else {
            guestCompletedStore.set([
              JSON.parse(window.localStorage.getItem("guestCompletedTitles")),
              ...data,
            ]);
            guestCompletedStore.update((data) => {
              data.push(title);
              return data;
            });
          }

          // store data into localstorage
          window.localStorage.setItem(
            "guestCompletedTitles",
            JSON.stringify($guestCompletedStore),
          );
        } else {
          // otherwise we set the localStorage then add it to the guestStore
          window.localStorage.setItem(
            "guestCompletedTitles",
            JSON.stringify([title]),
          );
          guestCompletedStore.update((data) => {
            return [title];
          });
        }
      }

      //remove it from the ongoing list
      guestRemoveTitle(title.id, false);

      // addToast({
      //   data: {
      //     title: "Success",
      //     description: "The title was marked as complete",
      //     color: "green",
      //   },
      //   closeDelay: 5000,
      //   type: "foreground",
      // });
    } catch (error) {
      // addToast({
      //   data: {
      //     title: "Error",
      //     description: "Could not add to completed list",
      //     color: "red",
      //   },
      //   closeDelay: 5000,
      //   type: "foreground",
      // });
    }
  }

  let modalRemove = (event) => {
    showModal = false;
    removeTitle(event.detail, false);
  };

  async function removeTitle(id, showToast) {
    let updatedBookList = bookListItems.filter((obj) => obj.id !== id);

    bookList.update(() => {
      if (browser) {
        window.localStorage.setItem(
          "savedBooks",
          JSON.stringify(updatedBookList),
        );
      }
      return updatedBookList;
    });

    const server_endpoint = "http://localhost:8200/books";
    let res = await fetch(server_endpoint, {
      method: "POST",
      body: JSON.stringify(updatedBookList),
      headers: {
        "Content-type": "applicaiton/json",
        Authorization: "ApiKey " + $page.data.user.apiKey,
      },
    });

    const list_data = await res.json();
    if (showToast) {
      if (res.status >= 400 && res.status < 500) {
        let update_errors = response?.error;

        // addToast({
        //   data: {
        //     title: "Error",
        //     description: "The title was not removed",
        //     color: "red",
        //   },
        //   closeDelay: 5000,
        //   type: "foreground",
        // });
      }

      // addToast({
      //   data: {
      //     title: "Success",
      //     description: "The title was removed!",
      //     color: "green",
      //   },
      //   closeDelay: 5000,
      //   type: "foreground",
      // });
    }
  }

  let modalComplete = (event) => {
    completedTitle(event.detail);
  };

  async function completedTitle(title) {
    if (browser) {
      if (!window.localStorage.getItem("completedTitles")) {
        window.localStorage.setItem("completedTitles", JSON.stringify(title));
      }
    }

    // add the title to the completed list
    CompletedStore.update((data) => {
      return [title, ...data];
    });
    window.localStorage.setItem(
      "completedTitles",
      JSON.stringify($CompletedStore),
    );

    //remove it from the ongoing list
    removeTitle(title.id, false);

    const updateUrl = "http://localhost:8200/completed";
    let res = await fetch(updateUrl, {
      method: "POST",
      body: JSON.stringify(title),
      headers: {
        "content-type": "application/json",
        Authorization: "ApiKey " + $page.data.user.apiKey,
      },
    });

    const completedRes = await res.json();

    if (res.status >= 400 && res.status < 500) {
      let update_errors = response?.error;

      // addToast({
      //   data: {
      //     title: "Error",
      //     description: "Title was not marked as complete",
      //     color: "red",
      //   },
      //   closeDelay: 5000,
      //   type: "foreground",
      // });
    }
    // addToast({
    //   data: {
    //     title: "Success",
    //     description: "Your title has been added to a completed list",
    //     color: "green",
    //   },
    //   closeDelay: 5000,
    //   type: "foreground",
    // });
  }

  let width;
</script>

<svelte:window bind:innerWidth={width} />
<div class="ovr-container">
  <div class="genre-container">
    {#if width >= 1200}
      <a href="/list-menu" class="return-button"
        ><Icon class="back-icon" icon="pixelarticons:arrow-left" />
        <p class="back-text">Back to Menu</p>
        <p></p></a
      >
    {/if}
    <a href="/list-menu" class="return-button"
      ><Icon class="back-icon" icon="pixelarticons:arrow-left" /></a
    >
    <h1 class="genre">My</h1>
    <h1 class="genre">Books</h1>
  </div>
  {#if browser}
    {#if data.api_key == "00000000-0000-0000-0000-000000000000"}
      {#if guestBookListItems && guestBookListItems.length > 0 && guestBookListItems[0] != null}
        <div class="movie-grid">
          {#each guestBookListItems as book}
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
      {/if}

      <div class="context-menu" {...$menu} use:menu>
        <div
          {...$item}
          use:item
          style="color:springgreen; padding-bottom:10px; cursor:pointer;"
          on:click={guestCompletedTitle(currentBook)}
        >
          Mark as Complete
        </div>
        <div
          {...$item}
          use:item
          style="color:red; cursor:pointer;"
          on:click={guestRemoveTitle(currentBook.id, true)}
        >
          Remove Title
        </div>
      </div>
    {/if}
    <!-- && $page.data.user.apiKey -->
    {#if bookListItems && bookListItems.length > 0 && bookListItems[0] != null}
      <div class="movie-grid">
        {#each bookListItems as book}
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
          on:click={removeTitle(currentBook.id, true)}
        >
          Remove Title
        </div>
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

    {#if data.api_key == "00000000-0000-0000-0000-000000000000" && (guestBookListItems?.length == 0 || !guestBookListItems)}
      <div class="empty-container">
        <p class="message">library's empty right now</p>
        <a class="search-link" href="/book-list/search">Try adding some books here => </a>
      </div>
    {:else if (bookListItems?.length || !bookListItems) == 0 && data.api_key}
      <div class="empty-container">
        <p class="message">library's empty right now</p>
        <a class="search-link" href="/book-list/search">Try adding some books here => </a>
      </div>
    {/if}
  {/if}
  <a href="/book-list/search/"
    ><button class="add-movie"><Icon icon="mdi:plus" /></button></a
  >
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
    color: #181818;
    font-size: 2rem;
    background-color: #f1dd00;
    border-radius: 36px;
    position: fixed;
    bottom: 1rem;
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
    grid-template-rows: repeat(10, 1fr);
    justify-items: center;
    padding: 10px;
    height: calc(100vh - 134px);
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
    height: 100vh;
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
      height: calc(100vh - 64px);
    }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: auto;
      justify-items: center;
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
