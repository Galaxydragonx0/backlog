<script>
	// @ts-nocheck

	import Icon from "@iconify/svelte";
	import { createEventDispatcher } from "svelte";

	// @ts-ignore
	export let showModal; // boolean

	// @ts-ignore
	/**
	 * @type {{ poster: any; }}
	 */
	export let book;
	export let titleLength;
	export let windowWidth;

	let dispatch = createEventDispatcher();

	function addTitle(){
		dispatch('addTitle', book);
	}
	
	// @ts-ignore
	/**
	 * @type {HTMLDialogElement}
	 */
	let dialog; // HTMLDialogElement

	// @ts-ignore
	$: if (dialog && showModal) dialog.showModal();

</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	class="dialog-pop"
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="movie-container"
		on:click|stopPropagation
		bind:this={dialog}
		on:close={() => (showModal = false)}
		on:click|self={() => dialog.close()}
	>
		<img
			alt="book poster"
			class="poster"
			src="https://books.google.com/books?id={book.id}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
		/>
		{#if windowWidth < 1200}
			{#if titleLength >= 42}
				<h2 class="name" style:font-size="normal">{book.volumeInfo.title}</h2>
			{:else if titleLength < 42}
				<h2 class="name" style:font-size="1.5rem">{book.volumeInfo.title}</h2>
			{/if}
		{:else if windowWidth >= 1200}
			{#if titleLength >= 42}
				<h2 class="name" style:font-size="1.5rem">{book.volumeInfo.title}</h2>
			{:else if titleLength < 42}
				<h2 class="name" style:font-size="2.5rem">{book.volumeInfo.title}</h2>
			{/if}
		{/if}
		<div class="position-change">
			<div class="information">
				<div class="misc">
					<p>Published Date:{book.volumeInfo?.publishedDate}</p>
					&nbsp;&nbsp;
					{#if book.volumeInfo?.averageRating}
						<p>Rating:{book.volumeInfo?.averageRating}</p>
					{/if}
				</div>
				{#if book?.volumeInfo}
					{#if titleLength >= 42}
						<h3
							class="desc"
							style="grid-row:9/14; isplay: flex;
					flex-direction: column-reverse;
					justify-content: center;"
						>{book?.volumeInfo.description}
						</h3>
					{:else if titleLength < 42}
						<h3 class="desc">{book?.volumeInfo.description}</h3>
					{/if}
				{/if}
			</div>

			<div class="action-buttons">
				<button class="add-button" on:click={addTitle}
					>Add to List <iconify-icon icon="pixelarticons:plus"></iconify-icon></button>
			</div>

		</div>
	</div>
	<button class="close-button" on:click={() => dialog.close()}><Icon icon="pixelarticons:close" /></button>
</dialog>

<style>
	@import url("https://fonts.googleapis.com/css2?family=DotGothic16&display=swap");

	@media screen and (min-height: 600px) {
		.dialog-pop {
			backdrop-filter: blur(20px) saturate(4);
			background-color: #181818;
			background: rgb(0 0 0 / 69%);
			border-radius: 10px;
			color: wheat;
			height: 95vh;
			width: 95vw;
		}

		.movie-container {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr;
			grid-template-rows: repeat(18, 0.125fr);
			grid-template-areas:
				"image image image image"
				"image image image image"
				"name name name name"
				"info info info info"
				"desc desc desc desc"
				"desc desc desc desc"
				"button button button button";
			height: -webkit-fill-available;
			font-family: "DotGothic16", sans-serif;
			font-weight: 400;
			font-style: normal;
			justify-items: center;
			align-items: center;
		}

		.position-change {
			grid-column: 1 / -1;
			grid-row: 8;
			position: relative;
		}

		.movie-container > .poster {
			grid-area: image;
			height: 260px;
			width: 185px;
			border-radius: 10px;
			grid-row: 2 / 4;
		}

		.movie-container > .name {
			grid-area: name;
			grid-row: 5;
			color: springgreen;
			text-align: center;
			padding: 1rem;
		}

		.movie-container > .position-change > .information {
			grid-row: 4 / 12;
			position: relative;
			grid-column: 1 / -1;
		}

		.movie-container > .position-change > .information > .misc {
			color: darkseagreen;
			font-size: small;
			width: 100%;
			display: inline-flex;
		}

		.movie-container > .position-change > .information > .desc {
			padding-top: 2rem;
			color: wheat;
			font-size: 1.01rem;
		}

		dialog {
			max-width: 32em;
			border-radius: 0.2em;
			border: none;
			padding: 0;
		}

		.close-button {
			color: red;
			position: absolute;
			top: 1rem;
			border-radius: 11px;
			font-size: 1.5rem;
			right: 1rem;
			background-color: midnightblue;
		}

		.action-buttons {
			position: absolute;
			width: 100%;
			height: 1rem;
			bottom: -5rem;
		}


		.add-button {
			color: green;
			position: absolute;
			bottom: 1rem;
			font-weight: bold;
			background-color: #040f41;
			padding: 5px;
			width: 100%;
			border-radius: 10px;
		}

		button :global(.remove-icon) {
			font-size: 1.2rem;
		}

		button :global(.complete-icon) {
			font-size: 1.2rem;
		}

		dialog::backdrop {
			background: rgba(0, 0, 0, 0.3);
		}

		dialog > div {
			padding: 1em;
		}

		dialog[open] {
			animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		}

		@keyframes zoom {
			from {
				transform: scale(0.95);
			}
			to {
				transform: scale(1);
			}
		}

		dialog[open]::backdrop {
			animation: fade 0.2s ease-out;
		}

		@keyframes fade {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		button {
			display: block;
		}
	}

	@media screen and (min-width: 1200px) {

		.dialog-pop {
			backdrop-filter: blur(20px) saturate(4);
			background-color: #181818;
			background: rgb(0 0 0 / 69%);
			border-radius: 10px;
			color: wheat;
			height: 95vh;
			max-height: calc(100vh - 6rem);
			width: 95vw;
		}

		.movie-container {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr;
			grid-template-rows: repeat(18, 0.125fr);
			grid-template-areas:
				"image image image image"
				"image image image image"
				"name name name name"
				"info info info info"
				"desc desc desc desc"
				"desc desc desc desc";
			height: -webkit-fill-available;
			font-family: "DotGothic16", sans-serif;
			font-weight: 400;
			font-style: normal;
			justify-items: center;
			align-items: center;
		}

		.position-change {
			grid-column: 1 / -1;
			grid-row: 8;
			position: relative;
		}

		.movie-container > .poster {
			grid-area: image;
			height: 260px;
			width: 185px;
			border-radius: 10px;
			grid-row: 2 / 4;
		}

		.movie-container > .name {
			grid-area: name;
			grid-row: 5;
			color: springgreen;
			text-align: center;
			padding: 1rem;
		}

		.movie-container > .position-change > .information {
			grid-row: 4 / 12;
			position: relative;
			grid-column: 1 / -1;
			width: 26rem;
		}

		.movie-container > .position-change > .information > .misc {
			color: darkseagreen;
			font-size: small;
			width: 100%;
			display: inline-flex;
		}

		.movie-container > .position-change > .information > .desc {
			padding-top: 1rem;
			color: wheat;
			font-size: 1.01rem;
		}

		dialog {
			max-width: 32em;
			border-radius: 0.2em;
			border: none;
			padding: 0;
		}

		.close-button {
			color: red;
			position: absolute;
			top: 1rem;
			border-radius: 11px;
			font-size: 1.5rem;
			right: 1rem;
			background-color: midnightblue;
		}

		.action-buttons {
			position: absolute;
			bottom: -8rem;
			/* left: -3rem; */
			width: 100%;
		}
		.complete-button {
			position: absolute;
			bottom: 1rem;
			right: 3rem;
			background-color: #040f41;
			padding: 5px;
			border-radius: 10px;
			color: green;
			font-weight: bold;
		}

		.remove-button {
			color: darkred;
			position: absolute;
			bottom: 1rem;
			font-weight: bold;
			right: 14rem;
			background-color: #040f41;
			padding: 5px;
			border-radius: 10px;
		}

		button :global(.remove-icon) {
			font-size: 1.2rem;
		}

		button :global(.complete-icon) {
			font-size: 1.2rem;
		}

		dialog::backdrop {
			background: rgba(0, 0, 0, 0.3);
		}

		dialog > div {
			padding: 1em;
		}

		dialog[open] {
			animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		}

		@keyframes zoom {
			from {
				transform: scale(0.95);
			}
			to {
				transform: scale(1);
			}
		}

		dialog[open]::backdrop {
			animation: fade 0.2s ease-out;
		}

		@keyframes fade {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		button {
			display: block;
		}

		:global(.dialog-pop::-webkit-scrollbar) {
			width: 0.5rem;
		}

		:global(::-webkit-scrollbar-track) {
			background: black;
		}

		:global(::-webkit-scrollbar-thumb) {
			background: #181818;
			border-radius: 10px;
		}
	}
</style>
