<script>
	import Header from "../../components/Header.svelte";
	// @ts-ignore
	// @ts-ignore
	import { fade, slide } from "svelte/transition";
	import UserDataStore from "../UserDataStore.js";
	import { CompletedStore } from "../CompletedTitleStore";
	import { visitCount } from "../VisitedCountStore";
	import Icon from "@iconify/svelte";
	import { browser } from "$app/environment";
	import { base } from '$app/paths';

	let topActive = false;
	$: showComplete = false;

	// @ts-ignore
	export let data;

	// @ts-ignore
	export let form;

	if (browser) {
		// @ts-ignore
		// let emailExists = window.localStorage.getItem('email');
		// if(emailExists) data.user_email = emailExists;

		if (
			!window.localStorage.getItem("completedTitles") &&
			data.completedListData
		) {
			window.localStorage.setItem(
				"completedTitles",
				JSON.stringify(data.completedListData),
			);
		}

		if (!form?.errors) {
			let user_email = data.user_email;
			let api_key = data.api_key;
			// @ts-ignore
			// @ts-ignore
			UserDataStore.update((data) => {
				return { user_email: user_email, api_key: api_key };
			});
		}
	}

	if (data?.completedListData && $visitCount > 0) {
		for (let i = 0; i < data?.completedListData.length; i++) {
			// @ts-ignore
			CompletedStore.update((currData) => {
				return [data.completedListData[i], ...currData];
			});
		}
		visitCount.update((data) => {
			return data++;
		});
	}

	/**@type {HTMLDialogElement}*/
	let dialog;

	// @ts-ignore
	// @ts-ignore
	$: if (dialog && showComplete) dialog.showModal();

	// @ts-ignore
	// @ts-ignore
	function showModal() {
		showComplete = true;
	}

	// @ts-ignore

	function closeModal() {
		document.querySelector(".complete-grid");

		let compModal = document.getElementsByClassName("completed-grid")[0];
		compModal.id = "close";
		showComplete = false;
	}

	/**@type {number}*/
	let width;
	/**@type {number}*/
	let height;
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
{#if browser}
	<Header
		modalPassthrough={data.modalPassthrough}
		auth_errors={data.auth_errors}
		formData={form}
		viewPassThrough={data.viewPassthrough}
	/>
{/if}
<nav class="grid" id="menu">
	<a class="menu-item selected" id="title-1" href="{base}/movie-list">
		<span class="menu-item-title1">Movies</span>
		{#if topActive}
			<span in:fade|global={{ delay: 300, duration: 500 }} class="menu-deco"
				>/</span
			>
			<span in:fade|global={{ delay: 300, duration: 500 }} class="menu-cta"
				><span>explore</span></span
			>
		{/if}
	</a>
	<a class="menu-item selected" id="title-2" href="{base}/show-list">
		<span class="menu__item-title">Shows</span>
		<!-- <span class="menu-deco">|</span>
		<span class="menu-cta"><span>explore</span> -->
	</a>
	<a class="menu-item selected" id="title-3" href="{base}/game-list">
		<span class="menu__item-title">Games</span>
		<!-- <span class="menu-deco">|</span>
		<span class="menu-cta"><span>explore</span> -->
	</a>
	<a class="menu-item selected" id="title-4" href="{base}/book-list">
		<span class="menu__item-title">Books</span>
		<!-- <span class="menu-deco">|</span>
		<span class="menu-cta"><span>explore</span></span> -->
	</a>

	{#if height >= 600}
		<a href="{base}/complete"
			><button class="comp-portal"
				><Icon
					class="down-icon"
					icon="pixelarticons:chevron-down"
				/><Icon
					class="down-icon"
					icon="pixelarticons:chevron-down"
				/></button
			></a
		>
	{/if}

	{#if width >= 1200}
		<a href="{base}/complete"
			><button class="comp-portal"
				>Completed <Icon
					class="down-icon"
					icon="pixelarticons:chevron-down"
				/></button
			></a
		>
	{/if}
</nav>

{#if showComplete == true}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<dialog
		bind:this={dialog}
		class="completed-grid"
		on:close={() => {
			closeModal();
		}}
		on:click|self={() => {
			dialog.close();
		}}
	>
		<!-- {#each data.compTitles as title}
		<p>This the completed div</p>
		<button id="close">Close Dialog!</button>
	{/each} -->
	</dialog>
{/if}

<style>
	@import "../../../styles.css";

	@font-face {
		src: url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,600;0,900;1,400;1,600;1,800;1,900&display=swap");
		font-family: "Rubik-Regular", sans-serif;
	}

	@font-face {
		font-family: "header-font";
		src: url("../../static/fonts/PublicPixel.ttf");
	}

	@import url("https://fonts.googleapis.com/css2?family=DotGothic16&display=swap");

	.grid {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: repeat(30, 1fr);
		width: 100%;
		position: fixed;
		background-color: #181818;
	}

	a {
		text-decoration: none;
		font-family: "Rubik-Regular", sans-serif;
		font-style: italic;
		font-weight: 700;
		font-size: clamp(4rem, 7vw, 10rem);
	}

	.menu-cta {
		font-style: normal;
		font-weight: 400;
		font-size: 1.65rem;
	}

	/* mobile styles */
	a {
		font-size: 2em;
	}

	.menu-item {
		color: wheat;
		font-family: "header-font";
	}

	.menu-item#title-1 {
		grid-column: 3/-1;
		grid-row: 3;
	}
	.menu-item#title-2 {
		grid-column: 3/-1;
		grid-row: 5;
	}
	.menu-item#title-3 {
		grid-column: 3/-1;
		grid-row: 7;
	}
	.menu-item#title-4 {
		grid-column: 3/-1;
		grid-row: 9;
	}

	/* short ahhhh phone */
	@media screen and (min-height: 600px) {
		.grid {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			grid-template-rows: repeat(32, 20px);
			height: calc(100vh - 95px);
		}

		a {
			font-size: 2em;
		}

		.menu-item#title-1 {
			grid-column: 6/13;
			grid-row: 14;
		}
		.menu-item#title-2 {
			grid-column: 6/13;
			grid-row: 17;
		}
		.menu-item#title-3 {
			grid-column: 6/13;
			grid-row: 20;
		}
		.menu-item#title-4 {
			grid-column: 6/13;
			grid-row: 23;
		}

		.menu-item {
			margin-top: 20px;
		}

		.comp-portal {
			position: absolute;
			bottom: 3rem;
			left: 0.5rem;
			width: 2.2rem;
			height: 3rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: red;
			border: none;
			border-radius: 5px;
			cursor: pointer;
		}

		button :global(.down-icon) {
			font-size: 1.2rem;
			margin-bottom: -3px;
		}
	}

	/* long ahhhh phone */
	@media screen and (min-height: 750px) {
		.grid {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			grid-template-rows: repeat(21, 40px);
			height: calc(100vh - 95px);
		}

		a {
			font-size: 2.3em;
		}

		.menu-item#title-1 {
			grid-column: 6/13;
			grid-row: 8;
		}
		.menu-item#title-2 {
			grid-column: 4/12;
			grid-row: 10;
			text-align: end;
		}
		.menu-item#title-3 {
			grid-column: 4/12;
			grid-row: 12;
			text-align: end;
		}
		.menu-item#title-4 {
			grid-column: 4/12;
			grid-row: 14;
			text-align: end;
		}

		.menu-item {
			margin-top: 20px;
		}

		.comp-portal {
			position: absolute;
			bottom: 3rem;
			left: 0.5rem;
			width: 2.2rem;
			height: 3rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: red;
			border: none;
			border-radius: 5px;
			cursor: pointer;
		}

		button :global(.down-icon) {
			font-size: 1.2rem;
			margin-bottom: -3px;
		}
	}

	/* small tablet styles */
	@media screen and (min-width: 620px) {
		a {
			font-size: 3em;
		}
	}

	/* large tablet & laptop styles */
	@media screen and (min-width: 960px) {
	}

	/* desktop styles */
	@media screen and (min-width: 1200px) {
		.comp-portal {
			width: 12rem;
			position: absolute;
			bottom: 12px;
			left: 9rem;
			font-size: 1rem;
			font-family: "header-font";
			background-color: #6d0000;
			color: #8888c9;
			border: beige;
			padding: 10px 0 10px 0;
			border-radius: 5px;
			display: flex;
			flex-direction: row-reverse;
			justify-content: center;
			cursor: pointer;
		}

		.completed-grid {
			color: white;
			height: 3rem;
			width: 100vw;
			position: absolute;
			display: grid;
			background: none;
			backdrop-filter: blur(25px) saturate(0.5);
			justify-content: center;
		}

		/* pop up animations */

		.completed-grid {
			top: -70.5rem;
			animation: drop 1s ease forwards;
		}

		@keyframes drop {
			0% {
				opacity: 0;
			}
			70% {
				transform: translateY(20rem);
			}
			100% {
				transform: translateY(19.5rem);
			}
		}

		button :global(.down-icon) {
			font-size: 1.2rem;
			margin-bottom: -3px;
			margin-left: -9px;
		}

		a {
			font-size: 4.5em;
		}

		.menu-item#title-1 {
			grid-column: 9/13;
			grid-row: 8;
		}
		.menu-item#title-2 {
			grid-column: 9/11;
			grid-row: 11;
		}
		.menu-item#title-3 {
			grid-column: 9/11;
			grid-row: 14;
		}
		.menu-item#title-4 {
			grid-column: 9/11;
			grid-row: 17;
		}

		.menu-item {
			margin-top: 20px;
		}

		a:after {
			/* content: '»'; */
			text-shadow: 10px 2px #7b1f1f;
			grid-row: inherit;
			grid-column: 10/12;
			position: absolute;
			opacity: 0;
			top: 14px;
			right: -10px;
			transition: 0.5s;
			padding-right: 2.5rem;
		}

		a:hover {
			padding-right: 32px;
			padding-left: 10px;
			text-shadow: 10px 2px #7b1f1f;
		}

		a:hover:after {
			opacity: 1;
			right: 10px;
		}
	}
</style>
