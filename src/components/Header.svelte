<script>
	// @ts-nocheck
	import Login from './Login.svelte';
	import Icon from '@iconify/svelte';
	import { authUser } from '$lib/firebase/auth';
	import { base } from '$app/paths';

	let showModal = false;
	const toggleModal = () => (showModal = !showModal);
	// @ts-ignore
	const closeModal = (event) => (showModal = !event.detail);
</script>

<header style="line-height: normal;">
	<a class="logo-link" href="{base}/list-menu">
		<p class="the">the</p>
		<p class="backlog">Backlog</p>
	</a>

	<!-- $authUser: undefined = still resolving (render nothing, avoids flicker),
	     null = signed out, object = signed in. -->
	{#if $authUser}
		<button class="avatar-pic" on:click={toggleModal} aria-label="Account">
			{#if $authUser.photoURL}
				<img class="avatar-photo" src={$authUser.photoURL} alt="" referrerpolicy="no-referrer" />
			{:else}
				<Icon class="avatar" icon="carbon:user-avatar-filled-alt" />
			{/if}
		</button>
	{:else if $authUser === null}
		<button class="avatar-pic" on:click={toggleModal} aria-label="Sign in">
			<Icon class="avatar" icon="carbon:user-avatar-filled-alt" />
		</button>
	{/if}

	<Login {showModal} on:closeModal={closeModal} />
</header>

<style>
	@font-face {
		font-family: 'header-font';
		src: url('../../static/fonts/PublicPixel.ttf');
	}

	header {
		background: #181818;
		padding: 1rem;
		/* Clear the Dynamic Island / punch-hole + status bar at the top
		   and any notch insets on the sides (landscape). */
		padding-top: calc(2rem + var(--safe-top, env(safe-area-inset-top, 0px)));
		padding-left: calc(1rem + var(--safe-left, env(safe-area-inset-left, 0px)));
		padding-right: calc(1rem + var(--safe-right, env(safe-area-inset-right, 0px)));
	}

	.logo-link {
		text-decoration: none;
	}

	.the,
	.backlog {
		font-weight: 1000;
		font-family: 'header-font';
		font-size: 1.5rem;
		color: red;
		margin: 0;
	}

	.avatar-pic {
		color: wheat;
		position: absolute;
		top: calc(1.2rem + var(--safe-top, env(safe-area-inset-top, 0px)));
		right: calc(1rem + var(--safe-right, env(safe-area-inset-right, 0px)));
		height: 4rem;
		width: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 25px;
		font-size: 2.5rem;
		overflow: hidden;
		background-color: #181818;
		cursor: pointer;
		padding: 0;
	}

	.avatar-photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}

	/* desktop styles */
	@media screen and (min-width: 1200px) {
		header {
			padding-left: calc(3rem + var(--safe-left, env(safe-area-inset-left, 0px)));
		}

		.the,
		.backlog {
			font-size: 2rem;
		}
	}
</style>
