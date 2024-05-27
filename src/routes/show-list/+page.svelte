<script>
  // @ts-nocheck
  import { browser } from "$app/environment";
  import { showList, guestShowList } from "../ShowStore";
  import UserDataStore from "../UserDataStore";
  // import { addToast } from "../../components/Toaster.svelte";
  import Icon from "@iconify/svelte";
  import { CompletedStore, guestCompletedStore } from "../CompletedTitleStore";
  import { page } from "$app/stores";
  import Title from "../../components/Title.svelte";
  import ModalTwo from "../../components/ModalTwo.svelte";
  import { createContextMenu, melt, createTooltip } from "@melt-ui/svelte";
  import { fade, blur } from "svelte/transition";
  import { base } from '$app/paths';

  export let data;

  $: userData = $UserDataStore;
  $: showListItems = $showList;
  $: guestShowListItems = $guestShowList;
  $: currentShow = {};
  $: showModal = false;

  let showStrLength;

  // if the user is a guest we neeed to load the appropriate lists
  if (data.api_key == "00000000-0000-0000-0000-000000000000" && !data.shows) {
    guestShowList.update((data) => {
      if (browser) {
        // takes the saved local storage and updates the guest list to that
        let savedShows = JSON.parse(window.localStorage.getItem("guestShows"));
        return savedShows;
      }
    });
    guestShowListItems = $guestShowList;

  } else if (data.shows) {
    showListItems = data.shows;
  }

  // context menu
  const {
    elements: { menu, item, trigger },
  } = createContextMenu();

  let toggleModal = (show) => {
    currentShow = show;
    showStrLength = currentShow.name.length;
    showModal = !showModal;
  };

  // adds list to localstorage for backup
  showList.update(() => {
    if (browser) {
      window.localStorage.setItem("savedShows", JSON.stringify(data.shows));
    }
    return data.shows;
  });

  function selectShow(show) {
    currentShow = show;
  }

  async function guestRemoveTitle(id, showToast) {
    try {
      let updatedShowList = guestShowListItems.filter((obj) => obj.id !== id);
      guestShowList.update(() => {
        if (browser) {
          window.localStorage.setItem(
            "guestShows",
            JSON.stringify(updatedShowList),
          );
        }
        return updatedShowList;
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
    if (data.api_key == "00000000-0000-0000-0000-000000000000") {
      guestRemoveTitle(event.detail, false);
      return;
    }
    removeTitle(event.detail, false);
  };

  async function removeTitle(id, showToast) {
    let updatedShowList = showListItems.filter((obj) => obj.id !== id);

    showList.update(() => {
      if (browser) {
        window.localStorage.setItem(
          "savedShows",
          JSON.stringify(updatedShowList),
        );
      }
      return updatedShowList;
    });

    const server_endpoint = "http://localhost:8200/shows";
    let res = await fetch(server_endpoint, {
      method: "POST",
      body: JSON.stringify(updatedShowList),
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
    if (data.api_key == "00000000-0000-0000-0000-000000000000") {
      guestCompletedTitle(event.detail, false);
      return;
    }
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
      <a href="{base}/list-menu" class="return-button"
        ><Icon class="back-icon" icon="pixelarticons:arrow-left" />
        <p class="back-text">Back to Menu</p>
        <p></p></a
      >
    {:else if width<1200}
    <a href="{base}/list-menu" class="return-button"
      ><Icon class="back-icon" icon="pixelarticons:arrow-left" /></a
    >
    {/if}
    <h1 class="genre">My</h1>
    <h1 class="genre">Shows</h1>
  </div>
  {#if browser}
    {#if data.api_key == "00000000-0000-0000-0000-000000000000"}
      {#if guestShowListItems && guestShowListItems.length > 0 && guestShowListItems[0] != null}
        <div class="movie-grid">
          {#each guestShowListItems as show}
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
      {/if}

      <div class="context-menu" {...$menu} use:menu>
        <div
          {...$item}
          use:item
          style="color:springgreen; padding-bottom:10px; cursor:pointer;"
          on:click={guestCompletedTitle(currentShow)}
        >
          Mark as Complete
        </div>
        <div
          {...$item}
          use:item
          style="color:red; cursor:pointer;"
          on:click={guestRemoveTitle(currentShow.id, true)}
        >
          Remove Title
        </div>
      </div>
    {/if}
    <!-- && $page.data.user.apiKey -->
    {#if showListItems && showListItems.length > 0 && showListItems[0] != null}
      <div class="movie-grid">
        {#each showListItems as show}
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
          on:click={removeTitle(currentShow.id, true)}
        >
          Remove Title
        </div>
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

    {#if data.api_key == "00000000-0000-0000-0000-000000000000" && (guestShowListItems?.length == 0 || !guestShowListItems)}
      <div class="empty-container">
        <p class="message">
          If you add a CW show, you should pay me for this app (I don't judge
          tho)
        </p>
        <a class="search-link" href="{base}/show-list/search"
          >Try adding some shows here =>
        </a>
      </div>
    {:else if (!showListItems || showListItems?.length) == 0 && data.api_key}
      <div class="empty-container">
        <p class="message">
          If you add a CW show, you should pay me for this app (I don't judge
          tho)
        </p>
        <a class="search-link" href="{base}/show-list/search">Try adding some shows here => </a>
      </div>
    {/if}
  {/if}
  <a href="{base}/show-list/search/"
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
    src: url("../../static/fonts/PublicPixel.ttf");
  }

  .add-movie {
    color: #181818;
    font-size: 2rem;
    background-color: #ff5200;
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
    height: 100vh;
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
      overflow-y: hidden;
      height: calc(100vh - 64px);
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
